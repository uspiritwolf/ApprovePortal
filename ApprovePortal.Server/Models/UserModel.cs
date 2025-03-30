using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ApprovePortal.Server.Models
{
	public record UserModel
	{
		[Key]
		public long Id { get; init; }

		[Required, MaxLength(50)]
		public string Username { get; init; } = string.Empty;

		[Required]
		public string PasswordHash { get; init; } = string.Empty;

		[EmailAddress]
		public string Email { get; init; } = string.Empty;

		[InverseProperty(nameof(ApprovalModel.CreatedBy))]
		public virtual ICollection<ApprovalModel>? Approvals { get; init; }
	}
}
