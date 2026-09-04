namespace Core.DTOs;
public record UpdateProductDto(string Name, string Description, decimal Price, int Stock, string? ImageUrl);