using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Clinica.Core.DTOs.Usuarios;
using Clinica.Core.Models.Identity;
using Clinica.Data;
using Clinica.Services.IServices;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace Clinica.Services.Services;

public class AuthService(IConfiguration config, ClinicaContext context, UserManager<Usuario> userManager) : IAuthService
{
    private readonly IConfiguration  _config = config;
    private readonly ClinicaContext _context = context;
    private readonly UserManager<Usuario> _userManager = userManager;

    public async Task<IdentityResult> CrearUsuario(string username, string correo, string UsuarioCreacion)
    {
        var nuevoUsuario = new Usuario
        {
            UserName = username,
            Email = correo,
            IsEnabled = true,
            FechaCreacion = DateTime.UtcNow,
            FechaModificacion = DateTime.UtcNow,
            UsuarioCreacion = UsuarioCreacion
        };

        var defaultPassword = _config["Users:DefaultPassword"];
        if (string.IsNullOrWhiteSpace(defaultPassword))
            throw new InvalidOperationException("La configuración Users:DefaultPassword es obligatoria.");

        return await _userManager.CreateAsync(nuevoUsuario, defaultPassword);
    }

    public async Task<IdentityResult> CambiarContrasena(string username, string currentPassword, string newPassword)
    {
        var usuario = await _userManager.FindByNameAsync(username);
        if (usuario == null)
            return IdentityResult.Failed(new IdentityError { Code = "UserNotFound", Description = "No se encontró el usuario autenticado." });

        return await _userManager.ChangePasswordAsync(usuario, currentPassword, newPassword);
    }

    public async Task<bool> ValidarUsuario(string username, string password)
    {
        var usuario = await _context.Users.FirstOrDefaultAsync(u => u.UserName == username);

        if (usuario == null) return false;

        if (!usuario.IsEnabled) return false;

        return await _userManager.CheckPasswordAsync(usuario, password);

    }

    public string GenerarToken(string usuario)
    {

        var key = Encoding.ASCII.GetBytes(_config["Jwt:Key"]!);
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity([
                new Claim(ClaimTypes.Name, usuario),
                new Claim(ClaimTypes.Role, "Odontologo") // Aquí puedes manejar roles
            ]),
            Expires = DateTime.UtcNow.AddMinutes(Convert.ToDouble(_config["Jwt:DurationInMinutes"])),
            SigningCredentials = new SigningCredentials(
                new SymmetricSecurityKey(key), 
                SecurityAlgorithms.HmacSha256Signature
            ),
            Issuer = _config["Jwt:Issuer"],
            Audience = _config["Jwt:Audience"]
        };

        var tokenHandler = new JwtSecurityTokenHandler();

        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }
    public async Task<PageResponse<UsuarioDto>> ObtenerUsuarios(int pageNumber, int pageSize)
    {
        pageNumber = Math.Max(pageNumber, 1);
        pageSize = Math.Clamp(pageSize, 1, 100);

        var query = _context.Users.AsNoTracking();
        var totalRecords = await query.CountAsync();
        var usuarios = await query
            .OrderBy(u => u.UserName)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return new PageResponse<UsuarioDto>
        {
            Data = usuarios.Select(u => new UsuarioDto
            {
                Id = u.Id,
                UserName = u.UserName ?? string.Empty,
                Email = u.Email ?? string.Empty,
                FechaCreacion = u.FechaCreacion.ToString("yyyy-MM-dd HH:mm:ss"),
                IsEnabled = u.IsEnabled,
                FechaUltimaConexion = u.FechaUltimaConexion
            }).ToList(),
            PageNumber = pageNumber,
            PageSize = pageSize,
            TotalRecords = totalRecords
        };
    }

    public async Task ActualizarUltimaConexion(string usuario)
    {
        var user = await _userManager.FindByNameAsync(usuario);
        
        if (user != null)
        {
            user.FechaUltimaConexion = DateTime.Now;
            await _userManager.UpdateAsync(user); 
        }
    }

    public async Task<IdentityResult> DeshabilitarUsuario(string username)
    {
        var usuario = await _userManager.FindByNameAsync(username);
        if (usuario == null)
            return IdentityResult.Failed(new IdentityError { Code = "UserNotFound", Description = "No se encontró el usuario." });

        usuario.IsEnabled = false;
        usuario.FechaModificacion = DateTime.UtcNow;

        return await _userManager.UpdateAsync(usuario);
    }
    public async Task<IdentityResult> HabilitarUsuario(string username)
    {
        var usuario = await _userManager.FindByNameAsync(username);
        if (usuario == null)
            return IdentityResult.Failed(new IdentityError { Code = "UserNotFound", Description = "No se encontró el usuario." });

        usuario.IsEnabled = true;
        usuario.FechaModificacion = DateTime.UtcNow;

        return await _userManager.UpdateAsync(usuario);
    }
}