using Microsoft.AspNetCore.Mvc;
namespace API.Controllers;
[ApiController, Route("api/[controller]")]
public class CategoriesController : ControllerBase
{
    [HttpGet] public IActionResult Get() => Ok(new[] {
        new { id=1, name="Men's Clothing", icon="👕", count=120 },
        new { id=2, name="Jewelery", icon="💍", count=45 },
        new { id=3, name="Electronics", icon="📱", count=89 },
        new { id=4, name="Women's Clothing", icon="👗", count=150 },
        new { id=5, name="Local", icon="⭐", count=20 }
    });
}