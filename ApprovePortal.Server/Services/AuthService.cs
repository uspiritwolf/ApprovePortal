using ApprovePortal.Server.Configs;
using ApprovePortal.Server.Models;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace ApprovePortal.Server.Services
{
	public class AuthService(IOptions<AppSettings> options)
	{
		private JwtSecurityTokenHandler _tokenHandler = new();

		public string GenerateToken(UserModel user)
		{
			var claims = new[]
			{
				new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
				new Claim(ClaimTypes.Name, user.Username),
				new Claim(ClaimTypes.Role, "User"),
			};

			var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(options.Value.SecretKey));
			var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

			var token = new JwtSecurityToken(
				claims: claims,
				expires: DateTime.Now.AddMinutes(30),
				signingCredentials: creds
			);

			return _tokenHandler.WriteToken(token);
		}
	}
}
