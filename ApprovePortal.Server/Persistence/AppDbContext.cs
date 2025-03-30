using ApprovePortal.Server.Controllers;
using ApprovePortal.Server.Models;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace ApprovePortal.Server.DB
{
	public class AppDbContext : DbContext
	{
		public DbSet<UserModel> Users { get; set; }

		public DbSet<ApprovalModel> Approvals { get; set; }

		public DbSet<ApprovalTemplateModel> ApprovalTemplates { get; set; }

		protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
		{
			var dbPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "app.db");

			_ = optionsBuilder
				.UseSqlite($"Data Source={dbPath}")
				.UseLazyLoadingProxies();
		}

		protected override void OnModelCreating(ModelBuilder modelBuilder)
		{
			var options = new JsonSerializerOptions { };

			_ = modelBuilder.Entity<ApprovalModel>()
				.Property(a => a.State)
				.HasConversion(
					v => JsonSerializer.Serialize(v, options),
					v => JsonSerializer.Deserialize<ApprovalStateModel>(v, options)!
				);

			_ = modelBuilder.Entity<ApprovalTemplateModel>()
				.Property(a => a.Steps)
				.HasConversion(
					v => JsonSerializer.Serialize(v, options),
					v => JsonSerializer.Deserialize<List<ApprovalStepTemplateModel>>(v, options)!
				);

			// Create Default Admin
			modelBuilder.Entity<UserModel>().HasData(
				new UserModel { Id = 1, Username = "Admin", PasswordHash = AuthController.ComputeSha256Hash("Admin") }
			);
		}
	}
}
