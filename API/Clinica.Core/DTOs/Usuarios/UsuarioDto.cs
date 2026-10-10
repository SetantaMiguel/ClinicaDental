namespace Clinica.Core.DTOs.Usuarios
{
    public class UsuarioDto
    {
        public string Id { get; set; } = string.Empty;
        public string UserName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;   
        public string FechaCreacion { get; set; } = string.Empty;
        public bool IsEnabled { get; set; }
        public DateTime? FechaUltimaConexion { get; set; }
    }
}
