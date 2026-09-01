using Clinica.Core.Models;
using Clinica.Services.IServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Clinica.Api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class CatalogoCitaController(ICatalogoCitaService service) : ControllerBase
    {
        private readonly ICatalogoCitaService _Service = service;

        [HttpGet()]
        public async Task<ActionResult<IEnumerable<CatalogoCitas>>> GetCatalogo()
        {
            var resp = await _Service.GetAllOrderedAsync(nameof(CatalogoCitas.Id),false);
            return Ok(resp);
        }        
        
        [HttpGet("base/{id:int}")]
        public async Task<ActionResult<decimal>> DameMontoBase(int id)
        {
            var resp = await _Service.GetSingleSelectedAsync(c => c.PrecioBase,c=>c.Id == id);

            return Ok(resp);
        }

        [HttpGet("Vigentes")]
        public async Task<ActionResult<IEnumerable<CatalogoCitas>>> GetCatalogoVigentes()
        {
            var resp = await _Service.GetFilteredAndOrderedAsync(u => u.Vigente == true ,nameof(CatalogoCitas.Id),false);

            return Ok(resp);
        }

        [HttpPost()]
        public async Task<ActionResult<CatalogoCitas>> CreateCatalogo([FromBody] CatalogoCitas catalogoCita)
        {
            var created = await _Service.AddAsync(catalogoCita);
            return CreatedAtAction(nameof(GetCatalogo), new { id = created.Id }, created);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> UpdateCatalogo(int id, [FromBody] CatalogoCitas catalogoCita)
        {
            if (id != catalogoCita.Id)
            {
                return BadRequest();
            }

            await _Service.UpdateAsync(catalogoCita);
            return NoContent();
        }
    }
}