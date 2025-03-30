using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ApprovePortal.Server.Models
{
	public record ApprovalModel
	{
		[Key]
		public long Id { get; init; }

		[Required]
		public long CreatedById { get; init; }

		[Required]
		public string Title { get; init; } = string.Empty;

		[Required]
		public string Description { get; init; } = string.Empty;

		public required ApprovalStateModel State { get; init; }

		[ForeignKey(nameof(CreatedById))]
		public virtual UserModel? CreatedBy { get; init; }
	}
}
