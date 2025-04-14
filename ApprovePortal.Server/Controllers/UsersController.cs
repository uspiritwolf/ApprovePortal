using ApprovePortal.Server.DB;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ApprovePortal.Server.Controllers
{
	[Authorize]
	[ApiController]

	[Route("api/[controller]")]
	public class UsersController : ControllerBase
	{

		[HttpGet("search")]
		public async Task<IActionResult> Search([FromQuery] string? q, [FromQuery] int? f, [FromServices] AppDbContext db, CancellationToken ct)
		{
			var query = db.Users.AsQueryable().AsNoTracking();

			if (q is not null)
			{
				query = query.Where(u => u.Username.Contains(q) || u.Name.Contains(q) || u.Email.Contains(q));
			}

			if (f is not null)
			{
				query = query.Take(f ?? 10);
			}

			var result = await query
				.OrderBy(u => u.Username).ThenBy(u => u.Name).ThenBy(u => u.Email)
				.Select(u => new
				{
					u.Id,
					u.Username,
					u.Name,
					u.Email
				}).ToListAsync(ct);

			return Ok(result);
		}
	}
}
