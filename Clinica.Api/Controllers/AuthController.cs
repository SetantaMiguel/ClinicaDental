using System.Threading.Tasks;
using Clinica.Core.Models;
using Clinica.Core.Models.Identity;
using Clinica.Data;
using Clinica.Services.IServices;
using Microsoft.AspNetCore.Mvc;

namespace Clinica.Api.Controllers{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController(IAuthService authService) : ControllerBase
    {
        private readonly IAuthService _authService = authService;

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            if (request == null || string.IsNullOrWhiteSpace(request.Username) 
            || string.IsNullOrWhiteSpace(request.Password))
                return BadRequest(new { message = "Usuario y contraseña requeridos." });

            if (await _authService.ValidarUsuario(request.Username, request.Password))
            {
                var token = _authService.GenerarToken(request.Username);
                return Ok(new { mensaje = "Login exitoso", token, username = request.Username });
            }

            return Unauthorized(new { message = "Credenciales inválidas." });
        }
        
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] Usuario request)
        {
            if (request == null 
            || string.IsNullOrWhiteSpace(request.UserName) 
            || string.IsNullOrWhiteSpace(request.PasswordHash))
                return BadRequest(new { message = "Usuario y contraseña requeridos." });

            var resultado = await _authService.CrearUsuario(request.UserName, request.PasswordHash, request.Email?.ToString() ?? string.Empty);
            
            if (resultado)
                return Ok(new { mensaje = "Usuario registrado exitosamente." });
            else
                return BadRequest(new { message = "Error al registrar el usuario." });  
        }

        public class LoginRequest
        {
            public string Username { get; set; } = string.Empty;
            public string Password { get; set; } = string.Empty;
        }
    }
}