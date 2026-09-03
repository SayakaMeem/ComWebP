using Microsoft.AspNetCore.Mvc;
namespace API.Controllers;
[ApiController, Route("api/[controller]")]
public class AuthController : ControllerBase
{
    [HttpPost("login")] public IActionResult Login([FromBody] LoginRequest req)
    {
        if(req.Email=="admin@comwebp.shop" && req.Password=="admin123")
            return Ok(new { email=req.Email, role="Admin", token="fake-jwt-admin" });
        return Ok(new { email=req.Email, role="Customer", token="fake-jwt-customer" });
    }
    [HttpPost("register")] public IActionResult Register([FromBody] RegisterRequest req) => Ok(new { message="Registered", email=req.Email, role=req.Role });
    public record LoginRequest(string Email, string Password);
    public record RegisterRequest(string Email, string Password, string Role, string FullName);
}