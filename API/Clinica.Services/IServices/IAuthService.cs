namespace Clinica.Services.IServices;

using Clinica.Core.DTOs.Usuarios;
using Microsoft.AspNetCore.Identity;

public interface IAuthService
{
    string GenerarToken(string usuario);
    Task ActualizarUltimaConexion(string usuario);
    Task<IdentityResult> CrearUsuario(string username, string correo, string UsuarioCreacion);
    Task<IdentityResult> CambiarContrasena(string username, string currentPassword, string newPassword);
    Task<bool> ValidarUsuario(string username, string password);
    Task<PageResponse<UsuarioDto>> ObtenerUsuarios(int pageNumber, int pageSize);
    Task<IdentityResult> DeshabilitarUsuario(string username);
    Task<IdentityResult> HabilitarUsuario(string username);
}