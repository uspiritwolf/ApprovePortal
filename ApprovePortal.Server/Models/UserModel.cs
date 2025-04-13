using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ApprovePortal.Server.Models
{
	public record UserModel
	{
		[Key]
		public Guid Id { get; init; } = Guid.NewGuid();

		[Required, MaxLength(50)]
		public string Username { get; init; } = string.Empty;

		[Required]
		public string PasswordHash { get; init; } = string.Empty;

		[Required, MaxLength(256)]
		public string Name { get; init; } = string.Empty;

		[EmailAddress]
		public string Email { get; init; } = string.Empty;

		// Navigation property
		[InverseProperty(nameof(ApprovalModel.CreatedBy))]
		public virtual ICollection<ApprovalModel> MyApprovals { get; init; } = null!;

		[InverseProperty(nameof(ApprovalApproverModel.User))]
		public virtual ICollection<ApprovalApproverModel> Approvals { get; init; } = null!;
	}
}
