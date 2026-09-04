namespace Core.DTOs;
public record PaginatedResponse<T>(List<T> Data, int Page, int PageSize, int TotalCount);