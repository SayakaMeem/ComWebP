using Core.DTOs;
using Core.Interfaces;
using Microsoft.AspNetCore.Mvc;
namespace API.Controllers;
[ApiController, Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly IProductService _s;
    public ProductsController(IProductService s){_s=s;}
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var paged = await _s.GetAllAsync(1,100,"","");
        return Ok(paged.Data); // <-- returns plain array, not object
    }
    [HttpGet("{id}")] public async Task<IActionResult> Get(int id)=> Ok(await _s.GetByIdAsync(id));
    [HttpPost] public async Task<IActionResult> Create(CreateProductDto dto)=> Ok(await _s.CreateAsync(dto));
    [HttpPut("{id}")] public async Task<IActionResult> Update(int id, UpdateProductDto dto)=> Ok(await _s.UpdateAsync(id,dto));
    [HttpDelete("{id}")] public async Task<IActionResult> Delete(int id)=> Ok(await _s.DeleteAsync(id));
}