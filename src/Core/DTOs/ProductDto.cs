namespace Core.DTOs;
public record ProductDto(int Id, string Name, string Description, decimal Price, int Stock, string ImageUrl, string Category, double Rating);
public record CreateProductDto(string Name, string Description, decimal Price, int Stock, string ImageUrl, string Category);
public record UpdateProductDto(string Name, string Description, decimal Price, int Stock, string ImageUrl);
public record PaginatedResponse<T>(List<T> Data, int Total, int Page, int PageSize);