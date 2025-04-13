using ApprovePortal.Server.DB;
using ApprovePortal.Server.Models;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ApprovePortal.Server.Persistence
{
	class UserNotFoundException : Exception
	{
		public UserNotFoundException() : base("User not found.") { }
	}

	class InvalidUserException : Exception
	{
		public InvalidUserException(string message) : base(message) { }
	}

	public static class DbExtension
	{
		public static Guid GetUserId(this ControllerBase controller)
		{
			var userIdClaim = controller.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
			if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userId))
				throw new InvalidUserException("Invalid user ID in token.");

			return userId;
		}

		public static UserModel GetCurrentUser(this AppDbContext db, ControllerBase controller)
		{
			var userId = controller.GetUserId();

			var user = db.Users.Find(userId);
			if (user == null)
				throw new UserNotFoundException();

			return user;
		}
	}
}
