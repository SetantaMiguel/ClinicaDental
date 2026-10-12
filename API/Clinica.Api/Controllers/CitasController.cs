using System.Linq.Expressions;
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
    public class CitasController(ICitasService citasService, IServiceCitaDetalleCatalogo citaDetalleCatalogoService) : ControllerBase
    {
        private readonly ICitasService _citasService = citasService;
        private readonly IServiceCitaDetalleCatalogo _citaDetalleCatalogoService = citaDetalleCatalogoService;

        [HttpGet]
        public async Task<ActionResult<PageResponse<CitaResumenDTO>>> GetCitas([FromQuery] CitaFiltroDto filtroDTO)
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

            var citasTipos = await _citaDetalleCatalogoService.GetFilteredAndOrderedAsync(ct => ct.CitaId == id, nameof(CitaDetalleCatalogo.CatalogoCitaId), true);

            if (citasTipos != null && citasTipos.Any())
            {
                cita.TiposCita = [.. citasTipos];
            }

            return Ok(cita);
        }

        [HttpGet("MontoBase/{id}")]
        public async Task<ActionResult<decimal>> Monto(int id)
        {
            var citaExists = await _citasService.ExistsAsync(c => c.Id == id);
            decimal montoBase = 0;

            if (!citaExists)
            {
                return NotFound();
            }

            var citasTipos = await _citaDetalleCatalogoService.GetFilteredAndOrderedAsync(ct => ct.CitaId == id
                , nameof(CitaDetalleCatalogo.CatalogoCitaId)
                , true
                , includes:
                [
                    x => x.CatalogoCita
                ]
            );

            foreach (var tipo in citasTipos)
            {
                if (tipo.CatalogoCita != null)
                {
                    montoBase += tipo.CatalogoCita.PrecioBase;
                }
            }

            return Ok(montoBase);
        }
       
        [HttpGet("DetalleTipos/{id}")]
        public async Task<ActionResult<IEnumerable<CitaDetalleCatalogo>>> TiposAgregados(int id)
        {
            var citaExists = await _citasService.ExistsAsync(c => c.Id == id);

            if (!citaExists)
            {
                return NotFound();
            }

            var citasTipos = await _citaDetalleCatalogoService.GetFilteredAndOrderedAsync(ct => ct.CitaId == id
                , nameof(CitaDetalleCatalogo.CatalogoCitaId)
                , true
                , includes:
                [
                    x => x.CatalogoCita
                ]
            );

            return Ok(citasTipos.Count > 0 ? citasTipos : []);
        }

        [HttpPut("{id:int}/tipos")]
        public async Task<IActionResult> ActualizarTiposCita(int id, [FromBody] int[] tiposCitaIds)
        {
            if (tiposCitaIds == null || tiposCitaIds.Length == 0)
            {
                return BadRequest("Debe especificar al menos un tipo de cita.");
            }

            var citaExiste = await _citasService.ExistsAsync(cita => cita.Id == id);
            if (!citaExiste)
            {
                return NotFound();
            }

            var actualizacionCorrecta = await _citaDetalleCatalogoService.ReemplazarTiposAsync(id, tiposCitaIds);
            if (!actualizacionCorrecta)
            {
                return BadRequest("Uno o más tipos de cita no existen.");
            }

            return NoContent();
        }

        [HttpPost]
        public async Task<ActionResult<Citas>> CreateCita([FromBody] CitaDTO citaDto)
        {
            var userId = User?.Identity?.Name ?? string.Empty; // Obtener el ID del usuario autenticado

            if (citaDto == null)
            {
                return BadRequest("Los datos de la cita son obligatorios.");
            }

            if (citaDto.TiposCita == null || !citaDto.TiposCita.Any())
            {
                return BadRequest("Debe especificar al menos un tipo de cita.");
            }

            // Instanciamos la cita asignando directamente la colección de detalles
            var cita = new Citas
            {
                FechaInicio = citaDto.FechaInicio,
                FechaFin = citaDto.FechaFin,
                Observaciones = citaDto.Observaciones,
                PacienteId = citaDto.PacienteId,
                EstadoCitaCodigo = "P", // Estado inicial "Pendiente"

                // Mapeo directo a la propiedad de navegación
                TiposCita = [.. citaDto.TiposCita.Select(tipoCitaId => new CitaDetalleCatalogo
                {
                    CatalogoCitaId = tipoCitaId
                })],
                UsuarioCreacion = userId
            };

            // Al guardar la cita, EF Core insertará la cita y los detalles en una sola transacción
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

            citaExistente.FechaInicio = citaDto.FechaInicio;
            citaExistente.FechaFin = citaDto.FechaFin;
            citaExistente.Observaciones = citaDto.Observaciones;
            citaExistente.PacienteId = citaDto.PacienteId;
            citaExistente.EstadoCitaCodigo = "R"; // Actualizar el estado de la cita si es necesario

            await _citaDetalleCatalogoService.DeleteByFilterAsync(cd => cd.CitaId == id); // Eliminar los tipos de cita existentes

            var tiposCita = new List<CitaDetalleCatalogo>();

            foreach (var tipoCitaId in citaDto.TiposCita)
            {
                tiposCita.Add(new CitaDetalleCatalogo
                {
                    CatalogoCitaId = tipoCitaId,
                    CitaId = citaExistente.Id
                });
            }

            await _citaDetalleCatalogoService.AddRangeAsync(tiposCita);

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