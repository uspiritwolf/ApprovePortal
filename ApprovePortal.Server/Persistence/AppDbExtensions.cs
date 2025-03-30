using ApprovePortal.Server.DB;
using Microsoft.EntityFrameworkCore;

namespace ApprovePortal.Server.Persistence
{
	public static class AppDbExtensions
	{
		public static void TrackGraphAsModified<TEntity>(this AppDbContext context, TEntity rootEntity)
		where TEntity : class => context.ChangeTracker.TrackGraph(rootEntity, node =>
										{
											if (node.Entry.IsKeySet)
											{
												node.Entry.State = EntityState.Modified;
											}
											else
											{
												node.Entry.State = EntityState.Added;
											}
										});

		public static void TrackGraphWithState<TEntity>(this AppDbContext context, TEntity rootEntity, EntityState state)
		where TEntity : class => context.ChangeTracker.TrackGraph(rootEntity, node =>
										{
											node.Entry.State = state;
										});

	}
}
