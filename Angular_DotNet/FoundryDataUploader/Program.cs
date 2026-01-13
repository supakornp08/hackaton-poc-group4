using FoundryDataUploader.Infrastructure;
using FoundryDataUploader.Application.Common.Behaviors;
using MediatR;

var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new() { 
        Title = "EXIM Bank AI API", 
        Version = "v2.0",
        Description = "Clean Architecture with CQRS and MediatR"
    });
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular", policy =>
    {
        policy.WithOrigins("http://localhost:4200", "http://localhost:4201")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Register MediatR
builder.Services.AddMediatR(cfg => 
{
    cfg.RegisterServicesFromAssembly(typeof(Program).Assembly);
    cfg.AddBehavior(typeof(IPipelineBehavior<,>), typeof(LoggingBehavior<,>));
});

// Register Infrastructure services (Clean Architecture)
var uploadPath = Path.Combine(builder.Environment.ContentRootPath, "Uploads");
builder.Services.AddInfrastructure(uploadPath);

var app = builder.Build();

// Configure the HTTP request pipeline - Enable Swagger for all environments
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "EXIM Bank AI API v2");
    c.RoutePrefix = "swagger";
});

app.UseCors("AllowAngular");

app.MapControllers();

// Simple health check at root
app.MapGet("/", () => Results.Ok(new { 
    status = "API is running", 
    version = "2.0.0",
    architecture = "Clean Architecture + CQRS + MediatR",
    timestamp = DateTime.UtcNow 
}));

app.Run();
