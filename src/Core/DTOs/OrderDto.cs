namespace Core.DTOs;
public record OrderDto(int Id, string BuyerEmail, decimal Total, string Status, DateTime OrderDate, List<OrderItemDto> Items);
public record OrderItemDto(string ProductName, decimal Price, int Quantity);
public record CreateOrderDto(string BuyerEmail, List<OrderItemDto> Items);