using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;

namespace ApprovePortal.Server.Models
{
	[PrimaryKey(nameof(ApprovalId), nameof(UserId))]
	public class ApprovalApproverModel
	{
		public required Guid ApprovalId { get; set; }

		public required Guid UserId { get; set; }

		public required ApprovalStatus Status { get; set; }

		// Navigation properties
		[ForeignKey(nameof(ApprovalId))]
		public virtual ApprovalModel Approval { get; set; } = null!;

		[ForeignKey(nameof(UserId))]
		public virtual UserModel User { get; set; } = null!;
	}
}
