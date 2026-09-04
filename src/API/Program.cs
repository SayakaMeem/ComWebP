
using Core.Interfaces;
using Infrastructure.Services;
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddCors(o => o.AddPolicy("AllowAll", p => p.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader()));
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSingleton<IProductService, ProductService>();
var app = builder.Build();
app.UseCors("AllowAll");
app.UseAuthorization();
app.MapControllers();
app.Run();