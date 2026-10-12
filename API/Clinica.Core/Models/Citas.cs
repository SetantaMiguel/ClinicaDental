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
        [Required]
        [StringLength(1)]
        public string EstadoCitaCodigo { get; set; } = string.Empty;
        [ForeignKey("EstadoCitaCodigo")]
        public virtual CatalogoEstadoCita? EstadoCita { get; set; }
        public virtual CitaRecibo? Recibo { get; set; }
        public string UsuarioCreacion { get; set; } = string.Empty;      
        // Navigation property for the many-to-one relationship with Pacientes
        public int PacienteId { get; set; }
        [ForeignKey("PacienteId")]
        public virtual Pacientes? Paciente { get; set; }
        // Navigation property for the many-to-many relationship with CatalogoCitas
        public virtual ICollection<CitaDetalleCatalogo>? TiposCita { get; set; }
    }
}