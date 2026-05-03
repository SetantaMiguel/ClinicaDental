using Clinica.Core.DTOs.Common;

public class PageResponse<T> : PaginacionDTO
{
    public IEnumerable<T>? Data { get; set; }

}