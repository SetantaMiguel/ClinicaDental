using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Clinica.Core.Models.Identity;
using Clinica.Data;
using Clinica.Services.IServices;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace Clinica.Services.Services;

public class AuthService(IConfiguration config,ClinicaContext context,UserManager<Usuario> userManager) : IAuthService
{
    private readonly IConfiguration  _config = config;
    private readonly ClinicaContext _context = context;
    private readonly UserManager<Usuario> _userManager = userManager;

    public async Task<bool> CrearUsuario(string username, string password, string correo)
    {
        var nuevoUsuario = new Usuario
        {
            UserName = username,
            Email = correo,
            PasswordHash = password
        };

        _context.Users.Add(nuevoUsuario);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> ValidarUsuario(string username, string password)
    {
        var usuario = await _context.Users.FirstOrDefaultAsync(u => u.UserName == username);

        if (usuario == null) return false;


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
}