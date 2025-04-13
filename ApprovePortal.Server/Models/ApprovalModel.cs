using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ApprovePortal.Server.Models
{
	public record ApprovalModel
	{
		[Key]
		public Guid Id { get; init; } = Guid.NewGuid();

		[Required]
		public required Guid CreatedById { get; init; }

		[Required]
		public string Title { get; init; } = string.Empty;

		[Required]
		public string Description { get; init; } = string.Empty;

		public DateTime CreatedAt { get; init; } = DateTime.UtcNow;

		// Navigation property
		[ForeignKey(nameof(CreatedById))]
		public virtual UserModel CreatedBy { get; init; } = null!;

		[InverseProperty(nameof(ApprovalApproverModel.Approval))]
		public virtual ICollection<ApprovalApproverModel> Approver { get; init; } = null!;

		// Business logic to compute the current approval status
		public ApprovalStatus ComputeStatus()
		{
			if (Approver.All(a => a.Status == ApprovalStatus.Approved))
			{
				return ApprovalStatus.Approved;
			}
			if (Approver.Any(a => a.Status == ApprovalStatus.Rejected))
			{
				return ApprovalStatus.Rejected;
			}
			return ApprovalStatus.Pending;
		}
	}
}
