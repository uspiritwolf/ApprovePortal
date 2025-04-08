using ApprovePortal.Server.DB;
using ApprovePortal.Server.DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ApprovePortal.Server.Controllers
{
	[Authorize]
	[Route("api/[controller]")]
	[ApiController]
	public class ApprovalController : ControllerBase
	{

		[HttpGet("list")]
		public ActionResult<List<ApprovalData>> GetList([FromServices] AppDbContext db) => Ok(new List<ApprovalData>()
		{
			new ApprovalData
			{
				Id = 0,
				Name = "William Smith",
				Email = "williamsmith@example.com",
				Subject = "Meeting Tomorrow",
				Date = "09:34 AM",
				Description = "Hi team, just a reminder about our meeting tomorrow at 10 AM.\nPlease come prepared with your project updates.",
				Status = "Pending",
			},
			new ApprovalData
			{
				Id = 1,
				Name = "Alice Smith",
				Email = "alicesmith@example.com",
				Subject = "Re: Project Update",
				Date = "Yesterday",
				Description = "Thanks for the update. The progress looks great so far.\nLet's schedule a call to discuss the next steps.",
				Status = "Pending",
			},
			new ApprovalData
			{
				Id = 2,
				Name = "Bob Johnson",
				Email = "bobjohnson@example.com",
				Subject = "Weekend Plans",
				Date = "2 days ago",
				Description = "Hey everyone! I'm thinking of organizing a team outing this weekend.\nWould you be interested in a hiking trip or a beach day?",
				Status = "Approved",
			},
			new ApprovalData
			{
				Id = 3,
				Name = "Emily Davis",
				Email = "emilydavis@example.com",
				Subject = "Re: Question about Budget",
				Date = "2 days ago",
				Description = "I've reviewed the budget numbers you sent over.\nCan we set up a quick call to discuss some potential adjustments?",
				Status = "Draft",
			},
			new ApprovalData
			{
				Id = 4,
				Name = "Michael Wilson",
				Email = "michaelwilson@example.com",
				Subject = "Important Announcement",
				Date = "1 week ago",
				Description = "Please join us for an all-hands meeting this Friday at 3 PM.\nWe have some exciting news to share about the company's future.",
				Status = "Rejected",
			},
			new ApprovalData
			{
				Id = 5,
				Name = "Sarah Brown",
				Email = "sarahbrown@example.com",
				Subject = "Re: Feedback on Proposal",
				Date = "1 week ago",
				Description = "Thank you for sending over the proposal. I've reviewed it and have some thoughts.\nCould we schedule a meeting to discuss my feedback in detail?",
				Status = "Pending",
			},
			new ApprovalData
			{
				Id = 6,
				Name = "David Lee",
				Email = "davidlee@example.com",
				Subject = "New Project Idea",
				Date = "1 week ago",
				Description = "I've been brainstorming and came up with an interesting project concept.\nDo you have time this week to discuss its potential impact and feasibility?",
				Status = "Pending",
			},
			new ApprovalData
			{
				Id = 7,
				Name = "Olivia Wilson",
				Email = "oliviawilson@example.com",
				Subject = "Vacation Plans",
				Date = "1 week ago",
				Description = "Just a heads up that I'll be taking a two-week vacation next month.\nI'll make sure all my projects are up to date before I leave.",
				Status = "Pending",
			},
			new ApprovalData
			{
				Id = 8,
				Name = "James Martin",
				Email = "jamesmartin@example.com",
				Subject = "Re: Conference Registration",
				Date = "1 week ago",
				Description = "I've completed the registration for the upcoming tech conference.\nLet me know if you need any additional information from my end.",
				Status = "Pending",
			},
			new ApprovalData
			{
				Id = 9,
				Name = "Sophia White",
				Email = "sophiawhite@example.com",
				Subject = "Team Dinner",
				Date = "1 week ago",
				Description = "To celebrate our recent project success, I'd like to organize a team dinner.\nAre you available next Friday evening? Please let me know your preferences.",
				Status = "Pending",
			}
		});
	}
}
