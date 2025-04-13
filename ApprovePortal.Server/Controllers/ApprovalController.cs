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

			var result = user.Approvals!.Select(a => new
			{
				Id = a.Id,
				Name = a.CreatedBy!.Username,
				Email = a.CreatedBy.Email,
				Subject = a.Title,
				Date = a.CreatedAt.ToString("MMMM dd, yyyy"),
				Description = a.Description,
				Status = a.State.Status.ToString(),
			}).ToList();

			return Ok(result);
		}

		[HttpPost("create")]
		public IActionResult CreateApproval([FromBody] CreateApprovalRequest req, [FromServices] AppDbContext db)
		{
			var user = db.GetCurrentUser(this);

			_ = db.Approvals.Add(new ApprovalModel
			{
				Title = req.Title,
				Description = req.Description,
				CreatedById = user.Id,
				CreatedAt = DateTime.UtcNow,
				State = new ApprovalStateModel
				{
					Steps = req.ApproverIds.Select(s => new ApprovalStateStepModel
					{
						ApproverId = s,
						Status = ApprovalStatus.Pending,
					}).ToList(),
				}
			});

			db.SaveChanges();

			return Ok();
		}
	}
}
