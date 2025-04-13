namespace ApprovePortal.Server.DTO
{
	public record CreateApprovalRequest
	{
		public required string Title { get; set; }
		public required string Description { get; set; }
		public required Guid[] ApproverIds { get; set; } = [];
	}
}
