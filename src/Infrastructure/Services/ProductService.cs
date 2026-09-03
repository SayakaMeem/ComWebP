using Core.DTOs;
using Core.Entities;
using Core.Interfaces;
using Infrastructure;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Services;
public class ProductService : IProductService
{
    private readonly AppDbContext _db;
    public ProductService(AppDbContext db) => _db = db;

    public async Task<PaginatedResponse<ProductDto>> GetAllAsync(int page, int pageSize, string search, string category)
    {
        var query = _db.Products.AsQueryable();
        if (!string.IsNullOrEmpty(search))
            query = query.Where(p => p.Name.Contains(search));
        var total = await query.CountAsync();
        var data = await query.Skip((page-1)*pageSize).Take(pageSize)
           .Select(p => new ProductDto(p.Id, p.Name, p.Description, p.Price, p.Stock, p.ImageUrl, "Local", 4.8)).ToListAsync();
        return new PaginatedResponse<ProductDto>(data, total, page, pageSize);
    }
    public async Task<ProductDto?> GetByIdAsync(int id)
    {
        var p = await _db.Products.FindAsync(id);
        return p == null? null : new ProductDto(p.Id, p.Name, p.Description, p.Price, p.Stock, p.ImageUrl, "Local", 4.8);
    }
    public async Task<ProductDto> CreateAsync(CreateProductDto dto)
    {
        var e = new Product { Name=dto.Name, Description=dto.Description, Price=dto.Price, Stock=dto.Stock, ImageUrl=dto.ImageUrl };
        _db.Products.Add(e);
        await _db.SaveChangesAsync();
        return new ProductDto(e.Id, e.Name, e.Description, e.Price, e.Stock, e.ImageUrl, dto.Category, 4.8);
    }
    public async Task<bool> UpdateAsync(int id, UpdateProductDto dto)
    {
        var e = await _db.Products.FindAsync(id);
        if(e==null) return false;
        e.Name=dto.Name; e.Description=dto.Description; e.Price=dto.Price; e.Stock=dto.Stock; e.ImageUrl=dto.ImageUrl;
        await _db.SaveChangesAsync();
        return true;
    }
    public async Task<bool> DeleteAsync(int id)
    {
        var e = await _db.Products.FindAsync(id);
        if(e==null) return false;
        _db.Products.Remove(e);
        await _db.SaveChangesAsync();
        return true;
    }
}