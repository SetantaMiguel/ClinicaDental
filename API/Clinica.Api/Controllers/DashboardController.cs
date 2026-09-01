using Clinica.Services.IServices;
using Microsoft.AspNetCore.Mvc;

namespace Clinica.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DashboardController(IDashboardService service) : ControllerBase
    {
        private readonly IDashboardService _service  = service;
      
        [HttpGet("{aniomes:int}")]
        public async Task<ActionResult<IEnumerable<object>>> DameResumen(int aniomes)
        {
            var resp = await _service.DameResumen(aniomes);
            return Ok(resp);
        }
        

    }
}