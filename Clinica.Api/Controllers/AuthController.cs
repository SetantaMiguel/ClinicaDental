using Microsoft.AspNetCore.Mvc;

namespace ClinicaDental.Clinica.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController(IAuthService authService) : ControllerBase
    {
        private readonly IAuthService _authService = authService;
        // POST api/auth/login
        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            if (request == null || string.IsNullOrWhiteSpace(request.Username) || string.IsNullOrWhiteSpace(request.Password))
                return BadRequest(new { message = "Usuario y contraseña requeridos." });

            // Validación simple y hardcodeada (sin BD)
            if (request.Username == "admin" && request.Password == "clinica123")
            {
                var token = _authService.GenerarToken(request.Username);

                return Ok(new { mensaje = "Login exitoso", token = token, username = request.Username });
            }

            return Unauthorized(new { message = "Credenciales inválidas." });
        }
        
        // DTO local dentro del mismo archivo
        public class LoginRequest
        {
            public string Username { get; set; } = string.Empty;
            public string Password { get; set; } = string.Empty;
        }
    }
}