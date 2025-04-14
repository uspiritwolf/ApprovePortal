namespace ApprovePortal.Server.Models
{
	[Flags]
	public enum UserRoleFlags
	{
		None = 0,
		User = 1 << 1,
		Manager = 1 << 2,
	}

	public static class UserRoleFlagsExtension
	{
		public static string GetMajorRole(this UserRoleFlags value)
		{
			if (value.HasFlag(UserRoleFlags.Manager))
				return "Manager";
			if (value.HasFlag(UserRoleFlags.User))
				return "User";
			return "Unknown";
		}
	}
}
