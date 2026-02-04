
using System.ComponentModel.DataAnnotations;

namespace Clinica.Core.Models;

public class Pacientes
{
    public int Id { get; set; }

    [Required]
    public string Nombre { get; set; } = string.Empty;
    [Required]
    public string Apellido { get; set; } = string.Empty;
    public DateTime? FechaNacimiento { get; set; }
    public string Telefono { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
}