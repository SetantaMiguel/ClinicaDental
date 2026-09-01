using Clinica.Core.DTOs.Citas;
using Clinica.Core.DTOs.Filters;
using Clinica.Core.Models;
using Clinica.Services.IServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Clinica.Api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class CitasController(ICitasService citasService) : ControllerBase
    {
        private readonly ICitasService _citasService = citasService;

        [HttpGet]
        public async Task<ActionResult<PageResponse<CitaResumenDTO>>>GetCitas([FromQuery] PacienteFiltroDTO filtroDTO)
        {
            var citas = await _citasService.ObtenerTodos(filtroDTO);
            return Ok(citas);
        }

        [HttpGet("recientes")]
        public async Task<ActionResult<PageResponse<CitaResumenDTO>>> Recientes()
        {
            var citas = await _citasService.ObtenerRecientes();
            return Ok(citas);
        }
        
        [HttpGet("{id}")]
        public async Task<ActionResult<CitaResumenDTO>> GetCita(int id)
        {
            var cita = await _citasService.GetByIdAsync(id);
            if (cita == null)
            {
                return NotFound();
            }
            return Ok(cita);
        }

        [HttpPost]
        public async Task<ActionResult<Citas>> CreateCita([FromBody] CitaDTO citaDto)
        {
            if (citaDto == null)
            {
                return BadRequest();
            }

            var cita = new Citas
            {
                TipoCitaId = citaDto.TipoCitaId,
                FechaInicio = citaDto.FechaInicio,
                FechaFin = citaDto.FechaFin,
                Observaciones = citaDto.Observaciones,
                PacienteId = citaDto.PacienteId,
                EstadoCitaCodigo = "P" // Asignar el estado inicial como "Pendiente"
            };

            var createdCita = await _citasService.AddAsync(cita);
            return CreatedAtAction(nameof(GetCita), new { id = createdCita.Id }, createdCita);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCita(int id, [FromBody] CitaDTO citaDto)
        {
            if (citaDto == null)
            {
                return BadRequest();
            }

            var citaExistente = await _citasService.GetByIdAsync(id);
            if (citaExistente == null)
            {
                return NotFound();
            }

            citaExistente.TipoCitaId = citaDto.TipoCitaId;
            citaExistente.FechaInicio = citaDto.FechaInicio;
            citaExistente.FechaFin = citaDto.FechaFin;
            citaExistente.Observaciones = citaDto.Observaciones;
            citaExistente.PacienteId = citaDto.PacienteId;
            citaExistente.EstadoCitaCodigo = "R"; // Actualizar el estado de la cita si es necesario

            await _citasService.UpdateAsync(citaExistente);
            return NoContent();
        }

        [HttpPatch("Cancelar/{id}")]
        public async Task<IActionResult> UpdateCita(int id)
        {

            var citaExistente = await _citasService.GetByIdAsync(id);
         
            if (citaExistente == null)
            {
                return NotFound();
            }

            citaExistente.EstadoCitaCodigo = "C"; // Actualizar el estado de la cita si es necesario

            await _citasService.UpdateAsync(citaExistente);
            return Ok();
        }
        
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCita(int id)
        {
            var cita = await _citasService.GetByIdAsync(id);
            if (cita == null)
            {
                return NotFound();
            }

            await _citasService.DeleteAsync(cita);
            return NoContent();
        }
    }
}