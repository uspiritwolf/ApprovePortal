using ApprovePortal.Server.DB;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDbContext>(ServiceLifetime.Singleton);

builder.Services.AddControllers();

var app = builder.Build();

AppDbContext dbContext = app.Services.GetRequiredService<AppDbContext>();
if (dbContext != null)
{
	dbContext.Database.EnsureCreated();
}

app.UseDefaultFiles();
app.MapStaticAssets();

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();
