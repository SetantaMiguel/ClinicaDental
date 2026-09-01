using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Clinica.Core.Models
{
    public class Moneda
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int IdMoneda { get; set; }

        [StringLength(3)]
        [Required]
        public string MonedaSimbolo { get; set; } = string.Empty;
        
        [StringLength(10)]
        [Required]
        public string MonedaDescripcion { get; set; } = string.Empty;
    }
}