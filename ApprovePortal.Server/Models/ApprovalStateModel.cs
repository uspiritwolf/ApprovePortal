using System.Text.Json.Serialization;

namespace ApprovePortal.Server.Models
{
	public enum ApprovalStatus
	{
		Pending,
		Approved,
		Rejected
	}

	public class ApprovalStateStepModel
	{
		public long ApproverId { get; init; }

		public ApprovalStatus Status { get; init; } = ApprovalStatus.Pending;
	}

	public class ApprovalStateModel
	{
		public List<ApprovalStateStepModel> Steps { get; init; } = new();

		[JsonIgnore]
		public ApprovalStatus Status
		{
			get => Steps.LastOrDefault()?.Status ?? ApprovalStatus.Pending;
		}
	}
}