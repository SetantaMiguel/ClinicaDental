using Clinica.Core.DTOs.Common;

namespace Clinica.Core.DTOs.Filters
{
    public class PacienteFiltroDTO : PaginacionDTO
    {
        public string Nombre { get; set; } = string.Empty;

        public string Apellido { get; set; } = string.Empty;
    }
}