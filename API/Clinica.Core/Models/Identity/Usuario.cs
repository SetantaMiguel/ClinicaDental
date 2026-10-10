using Microsoft.AspNetCore.Identity;

namespace Clinica.Core.Models. Identity
{
    public class Usuario : IdentityUser
    {
        public bool IsEnabled { get; set; }
        public DateTime FechaCreacion { get; set; }
        public DateTime FechaModificacion { get; set; }
        public DateTime? FechaUltimaConexion { get; set; }
        public string UsuarioCreacion { get; set; } = string.Empty;
    }
}