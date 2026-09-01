namespace Clinica.Services.IServices;

public interface IAuthService
{
    string GenerarToken(string usuario);
    Task<bool> CrearUsuario(string username, string password, string correo);
    Task<bool> ValidarUsuario(string username, string password);

}