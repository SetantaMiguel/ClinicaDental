using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Clinica.Core.Models
{
    public class Citas
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        [Required]
        public DateTime FechaInicio { get; set; }
        [Required]
        public DateTime FechaFin { get; set; }
        public string? Observaciones { get; set; }
        public int PacienteId { get; set; }
        [ForeignKey("PacienteId")]
        public virtual Pacientes? Paciente { get; set; }
        public int TipoCitaId { get; set; }
        [ForeignKey("TipoCitaId")]
        public virtual CatalogoCitas? TipoCita { get; set; }

        [Required]
        [StringLength(1)]
        public string EstadoCitaCodigo { get; set; } = string.Empty;
        [ForeignKey("EstadoCitaCodigo")]
        public virtual CatalogoEstadoCita? EstadoCita { get; set; }
        public virtual CitaRecibo? Recibo { get; set; }

    }
}