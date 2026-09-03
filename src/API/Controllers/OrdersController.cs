using Microsoft.AspNetCore.Mvc;
using Core.DTOs;
namespace API.Controllers;
[ApiController, Route("api/[controller]")]
public class OrdersController : ControllerBase
{
    private static List<OrderDto> _orders = new();
    [HttpGet] public IActionResult GetAll() => Ok(_orders);
    [HttpGet("stats")] public IActionResult GetStats() => Ok(new { totalOrders = _orders.Count, totalRevenue = _orders.Sum(o=>o.Total) });
    [HttpPost] public IActionResult Create(CreateOrderDto dto) { var order = new OrderDto(new Random().Next(1000,9999), dto.BuyerEmail, dto.Items.Sum(i=>i.Price*i.Quantity), "Pending", DateTime.UtcNow, dto.Items); _orders.Add(order); return Ok(order); }
    [HttpGet("by-email/{email}")] public IActionResult GetByEmail(string email) => Ok(_orders.Where(o=>o.BuyerEmail==email));
}