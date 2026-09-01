using Clinica.Core.Models;
using Clinica.Services.IServices;
using Clinica.Services.Services;
using Microsoft.AspNetCore.Mvc;

namespace Clinica.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CitasReciboController(ICitaReciboService citasService, ICitasService citaServicePrincipal) : ControllerBase
    {
        private readonly ICitaReciboService _citasService = citasService;
        private readonly ICitasService _citas = citaServicePrincipal;

        [HttpGet]
        public async Task<IReadOnlyList<CitaRecibo>> ObtenerTodos()
        {
            return await _citasService.GetAllOrderedAsync(nameof(CitaRecibo.IdRecibo), false);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<CitaRecibo>> DameDetalle(int id)
        {
            var recibo = await _citasService.GetByIdAsync(id);

            if (recibo == null)
            {
                return NotFound();
            }
            return Ok(recibo);
        }

        [HttpPost]
        public async Task<ActionResult<CitaRecibo>> GuardarDatos([FromBody] CitaRecibo reciboDto)
        {

            var citaExistente = await _citas.GetByIdAsync(reciboDto.CitaId);

            if (citaExistente == null) return NotFound("La cita original no existe.");

            citaExistente.EstadoCitaCodigo = "A";

            await _citas.UpdateAsync(citaExistente);
            var createdCita = await _citasService.AddAsync(reciboDto);

            return Ok(new{ id = createdCita.IdRecibo });

        }
        
        [HttpPut("{id}")]
        public async Task<ActionResult> ActualizarDatos(int id, [FromBody] CitaRecibo reciboDto)
        {
            if (id != reciboDto.IdRecibo) return BadRequest("El ID no coincide");

            // Tu lógica para actualizar:
            await _citasService.UpdateAsync(reciboDto);

            return NoContent(); // Respuesta estándar para un PUT exitoso
        }

    }
}