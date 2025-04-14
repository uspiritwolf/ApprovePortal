using ApprovePortal.Server.DB;
using ApprovePortal.Server.DTO;
using ApprovePortal.Server.Models;
using ApprovePortal.Server.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ApprovePortal.Server.Controllers
{
	[Authorize]
	[Route("api/[controller]")]
	[ApiController]
	public class ApprovalController : ControllerBase
	{

		[HttpGet("list")]
		public async Task<IActionResult> GetList([FromServices] AppDbContext db, CancellationToken ct)
		{
			var user = db.GetCurrentUser(this);

			var myApprovals = db.Entry(user).Collection(u => u.MyApprovals)
				.Query()
				.AsNoTracking()
				.Include(a => a.CreatedBy)
				.Include(a => a.Approvers).ThenInclude(aa => aa.User)
				.OrderByDescending(a => a.CreatedAt)
				.Select(a => new
				{
					Id = a.Id,
					CreatedBy = new
					{
						Id = a.CreatedById,
						Name = a.CreatedBy.Name,
						Email = a.CreatedBy.Email,
					},
					Title = a.Title,
					CreatedAt = a.CreatedAt,
					Date = a.CreatedAt.ToString("MMMM dd, yyyy, HH:mm"),
					Description = a.Description,
					Status = a.ComputeStatus().ToString(),
					Approvers = a.Approvers.Select(aa => new
					{
						Id = aa.UserId,
						Username = aa.User.Username,
						Name = aa.User.Name,
						Email = aa.User.Email,
						Status = aa.Status.ToString(),
					}),
				}).ToListAsync(ct);

			var otherApprovals = db.Entry(user).Collection(u => u.Approvals)
				.Query()
				.AsNoTracking()
				.Include(a => a.User)
				.Include(a => a.Approval).ThenInclude(aa => aa.CreatedBy)
				.OrderByDescending(a => a.Approval.CreatedAt)
				.Select(a => new
				{
					Id = a.ApprovalId,
					CreatedBy = new
					{
						Id = a.Approval.CreatedById,
						Name = a.Approval.CreatedBy.Name,
						Email = a.Approval.CreatedBy.Email,
					},
					Title = a.Approval.Title,
					CreatedAt = a.Approval.CreatedAt,
					Date = a.Approval.CreatedAt.ToString("MMMM dd, yyyy, HH:mm"),
					Description = a.Approval.Description,
					Status = a.Approval.ComputeStatus().ToString(),
					Approvers = a.Approval.Approvers.Select(aa => new
					{
						Id = aa.UserId,
						Username = aa.User.Username,
						Name = aa.User.Name,
						Email = aa.User.Email,
						Status = aa.Status.ToString(),
					}),
				}).ToListAsync(ct);

			var allApprovals = (await myApprovals).Concat(await otherApprovals).OrderByDescending(a => a.CreatedAt);

			return Ok(allApprovals);
		}

		[HttpPost("create")]
		public async Task<IActionResult> CreateApproval([FromBody] CreateApprovalRequest req, [FromServices] AppDbContext db, CancellationToken ct)
		{
			if (req.ApproverIds.Length == 0)
				return BadRequest("At least one approver is required.");

			var user = db.GetCurrentUser(this);

			if (req.ApproverIds.Any(a => a == user.Id))
				return BadRequest("You cannot approve your own approval.");

			if (req.ApproverIds.Distinct().Count() != req.ApproverIds.Length)
				return BadRequest("Approvers must be unique.");

			using var transaction = await db.Database.BeginTransactionAsync();

			try
			{
				var entry = await db.Approvals.AddAsync(new ApprovalModel
				{
					Title = req.Title,
					Description = req.Description,
					CreatedById = user.Id,
					CreatedAt = DateTime.UtcNow,
				});

				await db.SaveChangesAsync(ct);

				var tasks = req.ApproverIds.Select(approverId => db.ApprovalApprovers.AddAsync(new ApprovalApproverModel
				{
					ApprovalId = entry.Entity.Id,
					UserId = approverId,
					Status = ApprovalStatus.Pending,
				}).AsTask());

				Task.WaitAll(tasks.ToList(), ct);

				await db.SaveChangesAsync(ct);

				await transaction.CommitAsync(ct);

				return Ok();
			}
			catch (Exception ex)
			{
				await transaction.RollbackAsync();
				return BadRequest(ex.Message);
			}
		}

		[HttpPost("approve/{id}")]
		public async Task<IActionResult> Approve([FromRoute] Guid id, [FromServices] AppDbContext db, CancellationToken ct)
		{
			var user = db.GetCurrentUser(this);
			var rowsAffected = await db.ApprovalApprovers
				.Where(a => a.ApprovalId == id && a.UserId == user.Id)
				.ExecuteUpdateAsync(a => a.SetProperty(aa => aa.Status, ApprovalStatus.Approved), ct);

			if (rowsAffected == 0)
				return NotFound("No matching approver entry found.");

			await db.SaveChangesAsync(ct);
			return Ok();
		}

		[HttpPost("reject/{id}")]
		public async Task<IActionResult> Reject([FromRoute] Guid id, [FromServices] AppDbContext db, CancellationToken ct)
		{
			var user = db.GetCurrentUser(this);
			var rowsAffected = await db.ApprovalApprovers
				.Where(a => a.ApprovalId == id && a.UserId == user.Id)
				.ExecuteUpdateAsync(a => a.SetProperty(aa => aa.Status, ApprovalStatus.Rejected), ct);

			if (rowsAffected == 0)
				return NotFound("No matching approver entry found.");

			await db.SaveChangesAsync(ct);
			return Ok();
		}
	}
}
