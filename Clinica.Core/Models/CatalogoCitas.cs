using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Clinica.Core.Models
{
    public class CatalogoCitas
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        [Required]
        public string NombreCita { get; set; } = string.Empty;
        [Required]
        public string Descripcion { get; set; } = string.Empty;
        [Required]
        public bool Vigente { get; set; }

    }
}