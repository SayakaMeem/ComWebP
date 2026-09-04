using Microsoft.AspNetCore.Mvc;
namespace API.Controllers;
[ApiController, Route("api/[controller]")]
public class StatsController : ControllerBase
{
    [HttpGet] public IActionResult Get() => Ok(new { totalProducts=2, revenue=5000, serverTime=DateTime.UtcNow });
}
