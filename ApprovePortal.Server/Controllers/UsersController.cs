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
		public IActionResult Search([FromQuery] string q, [FromServices] AppDbContext db)
		{
			var users = db.Users
				.Where(u => EF.Functions.Like(u.Username, $"%{q}%") || EF.Functions.Like(u.Email, $"%{q}%"))
				.Select(u => new
				{
					u.Id,
					u.Username,
					u.Email
				})
				.ToList();
			return Ok(users);
		}
	}
}
