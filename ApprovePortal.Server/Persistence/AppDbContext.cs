using ApprovePortal.Server.Controllers;
using ApprovePortal.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace ApprovePortal.Server.DB
{
	public class AppDbContext : DbContext
	{
		public DbSet<UserModel> Users { get; set; }

		public DbSet<ApprovalModel> Approvals { get; set; }

		public DbSet<ApprovalApproverModel> ApprovalApprovers { get; set; }

		public DbSet<ApprovalTemplateModel> Templates { get; set; }

		protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
		{
			var dbPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "app.db");

			_ = optionsBuilder
				.UseSqlite($"Data Source={dbPath}")
				.UseLazyLoadingProxies();
		}

		protected override void OnModelCreating(ModelBuilder modelBuilder)
		{
			// Create Default Users
			_ = modelBuilder.Entity<UserModel>().HasData(
				new UserModel
				{
					Id = new Guid("4c1f2876-150a-4f13-94f5-cd3d2d9ce3b9"),
					Username = "Admin",
					Email = "admin@gmail.com",
					Name = "Administrator",
					PasswordHash = AuthController.ComputeSha256Hash("Admin"),
					Roles = UserRoleFlags.User | UserRoleFlags.Manager
				}
			);

			_ = modelBuilder.Entity<UserModel>().HasData(
				new UserModel
				{
					Id = new Guid("6c6570fd-f125-477d-9c47-2ee19f995d35"),
					Username = "User1",
					Email = "oleksii.chernykh@gmail.com",
					Name = "Oleksii Chernykh",
					PasswordHash = AuthController.ComputeSha256Hash("User1"),
					Roles = UserRoleFlags.User
				}
			);

			_ = modelBuilder.Entity<UserModel>().HasData(
				new UserModel
				{
					Id = new Guid("d986bc44-a453-41f5-a469-5bf4737ea25f"),
					Username = "User2",
					Email = "o.yashina@khai.edu",
					Name = "Olena Yashina",
					PasswordHash = AuthController.ComputeSha256Hash("User2"),
					Roles = UserRoleFlags.User
				}
			);
		}
	}
}
