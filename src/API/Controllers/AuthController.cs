using Microsoft.AspNetCore.Mvc;
namespace API.Controllers;
[ApiController, Route("api/[controller]")]
public class AuthController : ControllerBase
{
    [HttpPost("login")] public IActionResult Login([FromBody] LoginReq r) => Ok(new { token="fake-jwt", email=r.Email, role=r.Email.Contains("admin")?"Admin":"Customer" });
    [HttpPost("register")] public IActionResult Register([FromBody] RegisterReq r) => Ok(new { message="ok" });
}
public record LoginReq(string Email,string Password);
public record RegisterReq(string Email,string Password,string Role);
