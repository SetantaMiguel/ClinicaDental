using Microsoft.AspNetCore.Identity;

namespace Clinica.Core.Models. Identity
{
    public class Usuario : IdentityUser
    {
        public bool isEnabled { get; set; }
        public DateTime FechaCreacion { get; set; }
        public DateTime FechaModificacion { get; set; }
    }
}