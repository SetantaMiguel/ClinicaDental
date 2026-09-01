using System.ComponentModel.DataAnnotations;

namespace Clinica.Core.Models
{
    public class CatalogoEstadoCita
    {
        [Key]
        [Required]
        [StringLength(1)]
        public string Codigo { get; set; } = string.Empty;

        [Required]
        [StringLength(30)]
        public string Descripcion { get; set; } = string.Empty;

        [Required]
        public bool Estado { get; set; }
    }
}
