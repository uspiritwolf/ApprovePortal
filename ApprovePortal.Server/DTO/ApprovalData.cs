namespace ApprovePortal.Server.DTO
{
	public record ApprovalData
	{
		public required long Id { get; set; }

		public required string Name { get; set; }

		public required string Email { get; set; }

		public required string Subject { get; set; }

		public required string Date { get; set; }

		public required string Description { get; set; }

		public required string Status { get; set; }
	}
}
