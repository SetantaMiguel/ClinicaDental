using Clinica.Core.DTOs.Citas;

namespace Clinica.Core.DTOs.Pacientes
{
    public class HistorialPacienteDto : PacienteDTO
    {
        public List<CitaResumenDTO> Citas { get; set; } = [];
        public DateTime LastCitaDate { get; set; }
        public decimal MontoTotalPago { get; set; }
        public DateTime FIngreso { get; set; }
    }
}