using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Clinica.Core.Models
{
    public class CitaRecibo
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int IdRecibo { get; set; }
        [Required]
        public int CitaId { get; set; }
        [ForeignKey("CitaId")]
        public virtual Citas? Cita { get; set; }
        [Required]
        public decimal MontoNeto { get; set; }
        public string Observaciones { get; set; } = string.Empty;
        public short MedioPago { get; set; }       
        [Required]
        public int IdMoneda { get; set; }
        [ForeignKey("IdMoneda")]
        public virtual Moneda? Moneda { get; set; }
        public DateTime FIngreso { get; set; }

    }
}