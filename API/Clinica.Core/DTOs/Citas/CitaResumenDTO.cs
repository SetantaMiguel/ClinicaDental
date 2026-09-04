
using Clinica.Core.DTOs.Recibo;

namespace Clinica.Core.DTOs.Citas
{
    public class CitaResumenDTO
    {
        public int Id { get; set; }
        public int PacienteId { get; set; }
        public int TipoCitaId { get; set; }
        public DateTime FechaInicio { get; set; }
        public DateTime FechaFin { get; set; }
        public string? Observaciones { get; set; }
        public string PacienteNombre { get; set; } = string.Empty;
        public string TipoCitaNombre { get; set; } = string.Empty;
        public string EstadoCitaCodigo { get; set; } = string.Empty;
        public string EstadoCitaDescripcion { get; set; } = string.Empty;
        public ReciboDto? CitaRecibo { get; set; }
    }
}