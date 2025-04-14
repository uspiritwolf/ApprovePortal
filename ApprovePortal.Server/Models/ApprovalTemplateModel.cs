using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ApprovePortal.Server.Models
{
	public class ApprovalTemplateModel
	{
		[Key]
		public Guid Id { get; init; } = Guid.NewGuid();

		[Required]
		public required Guid CreatedById { get; init; }

		[Required]
		public required string Title { get; init; } = string.Empty;

		[Required]
		public required string Description { get; init; } = string.Empty;

		[Required]
		public required List<Guid> ApproverIds { get; init; } = new();

		// Navigation property
		[ForeignKey(nameof(CreatedById))]
		public virtual UserModel CreatedBy { get; init; } = null!;
	}
}
