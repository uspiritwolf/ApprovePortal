﻿using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ApprovePortal.Server.Models
{
	public class ApprovalStepTemplateModel
	{
		public long ApproverId { get; init; }
	}

	public class ApprovalTemplateModel
	{
		[Key]
		public long Id { get; set; }

		[Required]
		public long CreatedById { get; init; }

		[Required]
		public string Title { get; init; } = string.Empty;

		[Required]
		public string Description { get; init; } = string.Empty;

		public List<ApprovalStepTemplateModel> Steps { get; init; } = [];

		[ForeignKey(nameof(CreatedById))]
		public virtual UserModel? CreatedBy { get; init; }
	}
}
