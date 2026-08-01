using Clinica.Core.Models;
using Clinica.Data;
using Microsoft.AspNetCore.Mvc;
using Clinica.Core.DTOs;
using Microsoft.EntityFrameworkCore;
using Clinica.Services.IServices;
using Microsoft.AspNetCore.Authorization;
using Clinica.Core.DTOs.Filters;

namespace Clinica.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class PacientesController(ClinicaContext context, IPacienteService pacienteService) : ControllerBase
{
    private readonly ClinicaContext _context = context;
    private readonly IPacienteService _pacienteService = pacienteService;

    [HttpGet()]
    public async Task<ActionResult<PageResponse<Pacientes>>> GetPacientes([FromQuery] PacienteFiltroDTO filtro)
    {
        var pacientes = await _pacienteService.ObtenerTodos(filtro);
        return Ok(pacientes);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<PacienteDTO>> Get(int id)
    {
        var paciente = await _pacienteService.ObtenerPorId(id);
      
        if (paciente == null) return NotFound();

        return Ok(paciente);    
    }

    [HttpGet("buscar")]
    public async Task<ActionResult<List<PacienteDTO>>> Get([FromQuery] int? id, [FromQuery] string? nombre)
    {
       var pacientes = await _pacienteService.ObtenerPorId_NombreAsync(id, nombre);
       
       if (pacientes == null)  return NotFound();

        return Ok(pacientes);    
    }
 
    // POST: api/pacientes
    [HttpPost]
    public async Task<ActionResult<PacienteDTO>> Post([FromBody] PacienteDTO paciente)
    {
        if (paciente == null) return BadRequest();
        
        if (!ModelState.IsValid) return BadRequest(ModelState);
    
        if (await _context.Pacientes.AnyAsync(p => p.Telefono == paciente.Telefono))
        {
            return Conflict(new { message = "Ya existe un paciente con este número de teléfono." });        
        }

        var PacienteT = AsignarDT(paciente);

        var nuevoPaciente = await _pacienteService.Crear(PacienteT);

        return CreatedAtAction(nameof(GetPacientes), new { id = nuevoPaciente.Id });
    }

    public Pacientes AsignarDT(PacienteDTO paciente)
    {
        var PacienteT = new Pacientes
        {
            Nombre = paciente.Nombre,
            Apellido = paciente.Apellido,
            FechaNacimiento = paciente.FechaNacimiento,
            Telefono = paciente.Telefono,
            Email = paciente.Email,
            Identificacion = paciente.Identificacion
        };

        return PacienteT;
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, [FromBody] PacienteDTO paciente)
    {
        try{


            if (paciente == null) return BadRequest();

            if (!ModelState.IsValid) return BadRequest(ModelState);

            var pacienteExistente = await _pacienteService.ObtenerPorId(id);
            
            if (pacienteExistente == null) return NotFound();

            var pacienteActualizado = AsignarDT(paciente);

            pacienteActualizado.Id = id;

            _context.Pacientes.Update(pacienteActualizado);
            await _context.SaveChangesAsync();

            return Ok(pacienteActualizado);
        }
        catch (Exception)
        {
            return StatusCode(500, "Ocurrió un error al actualizar el paciente.");
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var paciente = await _pacienteService.ObtenerPorId(id);
        if (paciente == null) return NotFound();

        _context.Pacientes.Remove(paciente);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}