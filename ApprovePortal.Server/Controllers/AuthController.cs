using ApprovePortal.Server.DB;
using ApprovePortal.Server.DTO;
using ApprovePortal.Server.Models;
using ApprovePortal.Server.Persistence;
using ApprovePortal.Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Cryptography;
using System.Text;

namespace ApprovePortal.Server.Controllers
{
	[ApiController]
	[Route("api/[controller]")]
	public class AuthController(AuthService authService) : ControllerBase
	{
		public static string ComputeSha256Hash(string rawData) // TODO: Move to a utility class
		{
			using (SHA256 sha256Hash = SHA256.Create())
			{
				byte[] bytes = sha256Hash.ComputeHash(Encoding.UTF8.GetBytes(rawData));

				StringBuilder builder = new StringBuilder();
				foreach (byte b in bytes)
					builder.Append(b.ToString("x2"));

				return builder.ToString();
			}
		}

		[HttpPost("login")]
		public IActionResult Login([FromBody] LoginRequest req, [FromServices] AppDbContext db)
		{
			var user = db.Users.Where(u => u.Username == req.Username).FirstOrDefault();

			if (user == null)
				return NotFound();

			var PasswordHash = ComputeSha256Hash(req.Password);

			if (PasswordHash != user.PasswordHash)
				return Unauthorized();

			return Ok(new
			{
				token = authService.GenerateToken(user)
			});
		}

		[HttpPost("register")]
		public async Task<IActionResult> Register([FromBody] RegisterRequest req, [FromServices] AppDbContext db, CancellationToken ct)
		{
			var user = db.Users.Where(u => u.Username == req.Username).FirstOrDefault();

			if (user != null)
				return BadRequest("The user already exists");

			var entry = await db.Users.AddAsync(new UserModel
			{
				Username = req.Username,
				PasswordHash = ComputeSha256Hash(req.Password),
				Email = req.Email,
				Name = req.Name,
				Roles = UserRoleFlags.User
			}, ct);

			await db.SaveChangesAsync(ct);

			return Ok(new
			{
				token = authService.GenerateToken(entry.Entity)
			});
		}

		[Authorize]
		[HttpGet("me")]
		public IActionResult Me([FromServices] AppDbContext db)
		{
			var user = db.GetCurrentUser(this);

			return Ok(new
			{
				id = user.Id,
				username = user.Username,
				email = user.Email,
				name = user.Name,
				role = user.Roles.GetMajorRole()
			});
		}
	}
}
