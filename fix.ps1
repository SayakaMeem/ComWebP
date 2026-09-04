# Fix ProductService - NO DB
@"
using Core.DTOs;
using Core.Interfaces;
namespace Infrastructure.Services;
public class ProductService : IProductService
{
    private static List<ProductDto> _fake = new()
    {
        new ProductDto(1,"Backpack","Bag",109.95,10,"https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg","Men",4.8),
        new ProductDto(2,"T-Shirt","Cotton",22.3,5,"https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg","Men",4.5)
    };
    public Task<PaginatedResponse<ProductDto>> GetAllAsync(int p,int ps,string s,string c) => Task.FromResult(new PaginatedResponse<ProductDto>(_fake,p,ps,_fake.Count));
    public Task<ProductDto?> GetByIdAsync(int id) => Task.FromResult(_fake.FirstOrDefault(x=>x.Id==id));
    public Task<ProductDto> CreateAsync(CreateProductDto dto){ var x=new ProductDto(new Random().Next(100,999),dto.Name,dto.Description,dto.Price,dto.Stock,dto.ImageUrl,dto.Category,4.8); _fake.Add(x); return Task.FromResult(x); }
    public Task<bool> UpdateAsync(int id,UpdateProductDto dto)=>Task.FromResult(true);
    public Task<bool> DeleteAsync(int id){ var f=_fake.FirstOrDefault(x=>x.Id==id); if(f!=null)_fake.Remove(f); return Task.FromResult(true); }
}
"@ | Set-Content -Path "src\Infrastructure\Services\ProductService.cs" -Encoding utf8

# Fix Stats - NO DB
@"
using Microsoft.AspNetCore.Mvc;
namespace API.Controllers;
[ApiController, Route("api/[controller]")]
public class StatsController : ControllerBase
{
    [HttpGet] public IActionResult Get() => Ok(new { totalProducts=2, revenue=5000, serverTime=DateTime.UtcNow });
}
"@ | Set-Content -Path "src\API\Controllers\StatsController.cs" -Encoding utf8

# Fix Products
@"
using Core.DTOs;
using Core.Interfaces;
using Microsoft.AspNetCore.Mvc;
namespace API.Controllers;
[ApiController, Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly IProductService _s;
    public ProductsController(IProductService s){_s=s;}
    [HttpGet] public async Task<IActionResult> GetAll()=> Ok(await _s.GetAllAsync(1,100,"",""));
    [HttpGet("{id}")] public async Task<IActionResult> Get(int id)=> Ok(await _s.GetByIdAsync(id));
    [HttpPost] public async Task<IActionResult> Create(CreateProductDto dto)=> Ok(await _s.CreateAsync(dto));
    [HttpPut("{id}")] public async Task<IActionResult> Update(int id, UpdateProductDto dto)=> Ok(await _s.UpdateAsync(id,dto));
    [HttpDelete("{id}")] public async Task<IActionResult> Delete(int id)=> Ok(await _s.DeleteAsync(id));
}
"@ | Set-Content -Path "src\API\Controllers\ProductsController.cs" -Encoding utf8

# Fix Auth
@"
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
"@ | Set-Content -Path "src\API\Controllers\AuthController.cs" -Encoding utf8