using Microsoft.AspNetCore.Mvc;
using Infrastructure;
using Microsoft.EntityFrameworkCore;
namespace API.Controllers;
[ApiController, Route("api/[controller]")]
public class StatsController : ControllerBase
{
    private readonly AppDbContext _db;
    public StatsController(AppDbContext db) => _db = db;
    [HttpGet] public async Task<IActionResult> Get()
    {
        var totalProducts = await _db.Products.CountAsync();
        var totalValue = await _db.Products.SumAsync(p=>p.Price*p.Stock);
        return Ok(new { totalProducts, totalValue, totalCategories=5, revenue=125000, serverTime=DateTime.UtcNow });
    }
}