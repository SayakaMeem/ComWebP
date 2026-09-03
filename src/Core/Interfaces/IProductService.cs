using Core.DTOs;
namespace Core.Interfaces;
public interface IProductService
{
    Task<PaginatedResponse<ProductDto>> GetAllAsync(int page, int pageSize, string search, string category);
    Task<ProductDto?> GetByIdAsync(int id);
    Task<ProductDto> CreateAsync(CreateProductDto dto);
    Task<bool> UpdateAsync(int id, UpdateProductDto dto);
    Task<bool> DeleteAsync(int id);
}