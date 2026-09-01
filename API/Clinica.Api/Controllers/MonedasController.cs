using Clinica.Core.Models;
using Clinica.Services.IServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Clinica.Api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class MonedasController(IMonedaService service) : ControllerBase
    {
        private readonly IMonedaService _Service = service;

        [HttpGet("")]
        public async Task<ActionResult<IEnumerable<Moneda>>> GetMonedas()
        {
            var resp = await _Service.GetAllAsync();
            return Ok(resp);
        }
        

        [HttpPost("")]
        public async Task<ActionResult<Moneda>> CreateMoneda([FromBody] Moneda moneda)
        {
            var created = await _Service.AddAsync(moneda);
            
            // Retorna un código 201 Created. 
            // Asegúrate de pasar el nombre correcto de la propiedad que es IdMoneda.
            return CreatedAtAction(nameof(GetMonedas), new { id = created.IdMoneda }, created);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> UpdateMoneda(int id, [FromBody] Moneda moneda)
        {
            if (id != moneda.IdMoneda)
            {
                return BadRequest();
            }

            await _Service.UpdateAsync(moneda);
            return NoContent();
        }
    }
}