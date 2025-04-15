﻿namespace ApprovePortal.Server.DTO
{
	public class RegisterRequest
	{
		public required string Username { get; set; }
		public required string Password { get; set; }
		public required string Email { get; set; }
		public required string Name { get; set; }
	}
}
