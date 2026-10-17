using Clinica.Core.DTOs.Common;

namespace Clinica.Core.DTOs.Filters
{
    public class CatalogoDeCitaDto : PaginacionDTO
    {
        public int? Id { get; set; }
        public string? NombreCita { get; set; } = string.Empty;
        public string? Descripcion { get; set; } = string.Empty;
        public decimal? PrecioBase { get; set; } = 0;
        public bool? Vigente { get; set; }
    }
               
}