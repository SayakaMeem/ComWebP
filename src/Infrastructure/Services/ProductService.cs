using Core.DTOs;
using Core.Interfaces;

namespace Infrastructure.Services;
public class ProductService : IProductService
{
    private static List<ProductDto> _fake = new()
    {
        new ProductDto(1, "Backpack", "Fjallraven Backpack", 109.95m, 100, "https://picsum.photos/seed/1/400/400", "local", 4.9),
        new ProductDto(2, "T-Shirt", "Mens Casual T-Shirt", 22.3m, 50, "https://picsum.photos/seed/2/400/400", "local", 4.8),
        new ProductDto(3, "Jacket", "Mens Cotton Jacket", 55.99m, 30, "https://picsum.photos/seed/3/400/400", "local", 4.7),
        new ProductDto(4, "Slim Fit", "Mens Casual Slim Fit", 15.99m, 30, "https://picsum.photos/seed/4/400/400", "local", 4.6)
    };

    public Task<PaginatedResponse<ProductDto>> GetAllAsync(int p,int ps,string s,string c)
        => Task.FromResult(new PaginatedResponse<ProductDto>(_fake, p, ps, _fake.Count));

    public Task<ProductDto?> GetByIdAsync(int id)
        => Task.FromResult(_fake.FirstOrDefault(x=>x.Id==id));

    public Task<ProductDto> CreateAsync(CreateProductDto dto)
    {
        var id = _fake.Any()? _fake.Max(x=>x.Id)+1 : 1;
        var image = string.IsNullOrWhiteSpace(dto.ImageUrl)? $"https://picsum.photos/seed/{id}/400/400" : dto.ImageUrl;
        var prod = new ProductDto(id, dto.Name, dto.Description, dto.Price, dto.Stock, image, "local", 4.9);
        _fake.Add(prod);
        return Task.FromResult(prod);
    }

    public Task<bool> UpdateAsync(int id, UpdateProductDto dto)
    {
        var index = _fake.FindIndex(x=>x.Id==id);
        if(index==-1) return Task.FromResult(false);
        var existing = _fake[index];
        _fake[index] = existing with
        {
            Name = dto.Name,
            Description = dto.Description,
            Price = dto.Price,
            Stock = dto.Stock,
            ImageUrl = string.IsNullOrWhiteSpace(dto.ImageUrl)? existing.ImageUrl : dto.ImageUrl
        };
        return Task.FromResult(true);
    }

    public Task<bool> DeleteAsync(int id)
        => Task.FromResult(_fake.RemoveAll(x=>x.Id==id) > 0);
}