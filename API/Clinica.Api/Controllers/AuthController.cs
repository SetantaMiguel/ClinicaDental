using Clinica.Core.Models.Identity;
using Clinica.Services.IServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using System.Security.Claims;

namespace Clinica.Api.Controllers
{
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
                await _authService.ActualizarUltimaConexion(request.Username);
                return Ok(new { mensaje = "Login exitoso", token, username = request.Username });
            }

            return Unauthorized(new { message = "Credenciales inválidas." });
        }

        [Authorize]
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {

            var resultado = await _authService.CrearUsuario(request.Username,
                request.Email,
                User.FindFirst(ClaimTypes.Name)?.Value ?? string.Empty);

            if (resultado.Succeeded)
                return Ok(new { mensaje = "Usuario registrado exitosamente.", username = request.Username });

            return BadRequest(new
            {
                message = "No se pudo registrar el usuario.",
                errors = resultado.Errors.Select(error => error.Description)
            });
        }

        [Authorize]
        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest request)
        {
            var username = User.FindFirst(ClaimTypes.Name)?.Value;
            if (string.IsNullOrWhiteSpace(username))
                return Unauthorized();

            var resultado = await _authService.CambiarContrasena(
                username,
                request.CurrentPassword,
                request.NewPassword);

            if (resultado.Succeeded)
                return Ok(new { mensaje = "La contraseña se actualizó correctamente." });

            return BadRequest(new
            {
                message = "No se pudo actualizar la contraseña.",
                errors = resultado.Errors.Select(error => error.Description)
            });
        }

        [Authorize]
        [HttpGet("usuarios")]
        public async Task<IActionResult> ObtenerUsuarios([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
        {

            var usuarios = await _authService.ObtenerUsuarios(pageNumber, pageSize);
            return Ok(usuarios);
        }

        [Authorize]
        [HttpPut("deshabilitar-usuario/{username}")]
        public async Task<IActionResult> DeshabilitarUsuario(string username)
        {
            var resultado = await _authService.DeshabilitarUsuario(username);

            if (resultado.Succeeded)
                return Ok(new { mensaje = "Usuario deshabilitado exitosamente." });

            return BadRequest(new
            {
                message = "No se pudo deshabilitar el usuario.",
                errors = resultado.Errors.Select(error => error.Description)
            });
        }

        [Authorize]
        [HttpPut("habilitar-usuario/{username}")]
        public async Task<IActionResult> HabilitarUsuario(string username)
        {
            var resultado = await _authService.HabilitarUsuario(username);

            if (resultado.Succeeded)
                return Ok(new { mensaje = "Usuario habilitado exitosamente." });

            return BadRequest(new
            {
                message = "No se pudo habilitar el usuario.",
                errors = resultado.Errors.Select(error => error.Description)
            });
        }

        public class RegisterRequest
        {
            [Required]
            public string Username { get; set; } = string.Empty;

            [Required, EmailAddress]
            public string Email { get; set; } = string.Empty;

        }

        public class ChangePasswordRequest
        {
            [Required]
            public string CurrentPassword { get; set; } = string.Empty;

            [Required, MinLength(6)]
            public string NewPassword { get; set; } = string.Empty;
        }

        public class LoginRequest
        {
            public string Username { get; set; } = string.Empty;
            public string Password { get; set; } = string.Empty;
        }
    }
}