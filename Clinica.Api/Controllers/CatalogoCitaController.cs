using Clinica.Core.Models;
using Clinica.Services.IServices;
using Microsoft.AspNetCore.Mvc;

namespace Clinica.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CatalogoCitaController(ICatalogoCitaService service) : ControllerBase
    {
        private readonly ICatalogoCitaService _Service = service;

        [HttpGet("")]
        public async Task<ActionResult<IEnumerable<CatalogoCitas>>> GetCatalogo()
        {
            var resp = await _Service.ObtenerTodosAsync();
            return Ok(resp);
        }

        [HttpPost("")]
        public async Task<ActionResult<CatalogoCitas>> CreateCatalogo([FromBody] CatalogoCitas catalogoCita)
        {
            var created = await _Service.CrearAsync(catalogoCita);
            return CreatedAtAction(nameof(GetCatalogo), new { id = created.Id }, created);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> UpdateCatalogo(int id, [FromBody] CatalogoCitas catalogoCita)
        {
            if (id != catalogoCita.Id)
            {
                return BadRequest();
            }

            await _Service.ActualizarAsync(catalogoCita);
            return NoContent();
        }
    }
}