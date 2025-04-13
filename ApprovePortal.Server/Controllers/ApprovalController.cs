using ApprovePortal.Server.DB;
using ApprovePortal.Server.DTO;
using ApprovePortal.Server.Models;
using ApprovePortal.Server.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ApprovePortal.Server.Controllers
{
	[Authorize]
	[Route("api/[controller]")]
	[ApiController]
	public class ApprovalController : ControllerBase
	{

		[HttpGet("list")]
		public IActionResult GetList([FromServices] AppDbContext db)
		{
			var user = db.GetCurrentUser(this);

			var myApprovals = user.MyApprovals.Select(a => new
			{
				Id = a.Id,
				CreatedById = a.CreatedById,
				Name = a.CreatedBy!.Name,
				Email = a.CreatedBy.Email,
				Title = a.Title,
				Date = a.CreatedAt.ToString("MMMM dd, yyyy"),
				Description = a.Description,
				Status = a.ComputeStatus().ToString(),
			});

			var otherApprovals = user.Approvals.Select(a => new
			{
				Id = a.ApprovalId,
				CreatedById = a.Approval!.CreatedById,
				Name = a.Approval!.CreatedBy.Name,
				Email = a.Approval!.CreatedBy.Email,
				Title = a.Approval!.Title,
				Date = a.Approval.CreatedAt.ToString("MMMM dd, yyyy"),
				Description = a.Approval.Description,
				Status = a.Status.ToString(),
			});

			var allApprovals = myApprovals.Concat(otherApprovals).ToList();

			return Ok(allApprovals);
		}

		[HttpPost("create")]
		public async Task<IActionResult> CreateApproval([FromBody] CreateApprovalRequest req, [FromServices] AppDbContext db)
		{
			using var transaction = await db.Database.BeginTransactionAsync();

			try
			{
				var user = db.GetCurrentUser(this);

				var entry = await db.Approvals.AddAsync(new ApprovalModel
				{
					Title = req.Title,
					Description = req.Description,
					CreatedById = user.Id,
					CreatedAt = DateTime.UtcNow,
				});

				await db.SaveChangesAsync();

				var tasks = req.ApproverIds.Select(approverId => db.ApprovalApprovers.AddAsync(new ApprovalApproverModel
				{
					ApprovalId = entry.Entity.Id,
					UserId = approverId,
					Status = ApprovalStatus.Pending,
				}).AsTask());

				Task.WaitAll(tasks.ToList());

				await db.SaveChangesAsync();

				await transaction.CommitAsync();

				return Ok();
			}
			catch (Exception ex)
			{
				await transaction.RollbackAsync();
				return BadRequest(ex.Message);
			}
		}
	}
}
