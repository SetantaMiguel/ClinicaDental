using Clinica.Core.DTOs.Common;

namespace Clinica.Core.DTOs.Filters
{
    public class CitaFiltroDto : PaginacionDTO
    {
        public DateTime? FechaDesde { get; set; }
        public DateTime? FechaHasta { get; set; }
        public string? PacienteNombre { get; set; }
        public string? EstadoCitaCodigo { get; set; }
        public int? TipoCitaId { get; set; }
    }
}