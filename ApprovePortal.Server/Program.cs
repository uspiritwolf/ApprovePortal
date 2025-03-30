using ApprovePortal.Server.Configs;
using ApprovePortal.Server.DB;
using ApprovePortal.Server.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

var appSettingsSection = builder.Configuration.GetSection("AppSettings");
builder.Services.Configure<AppSettings>(appSettingsSection);

builder.Services.AddDbContext<AppDbContext>(ServiceLifetime.Singleton);
builder.Services.AddSingleton<AuthService>();
builder.Services.AddControllers();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
	.AddJwtBearer(options =>
	{
		var appSettings = appSettingsSection.Get<AppSettings>();
		options.TokenValidationParameters = new TokenValidationParameters
		{
			ValidateIssuer = false,
			ValidateAudience = false,
			ValidateLifetime = true,
			ValidateIssuerSigningKey = true,
			IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(appSettings!.SecretKey))
		};
	});

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
