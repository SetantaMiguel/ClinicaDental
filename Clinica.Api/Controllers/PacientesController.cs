using Clinica.Core.Models;
using Clinica.Data;
using Microsoft.AspNetCore.Mvc;
using Clinica.Core.DTOs;
using Microsoft.EntityFrameworkCore;
using Clinica.Services.IServices;
using Microsoft.AspNetCore.Authorization;

namespace Clinica.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class PacientesController : ControllerBase
{
    private readonly ClinicaContext _context;
    private readonly IPacienteService _pacienteService;

    public PacientesController(ClinicaContext context, IPacienteService pacienteService)
    {
        _context = context;
        _pacienteService = pacienteService;
    }
    
    [HttpGet("")]
    public async Task<ActionResult<PageResponse<Pacientes>>> GetPacientes(int pageNumber = 1, int pageSize = 5)
    {
        var pacientes = await _pacienteService.ObtenerTodos(pageNumber, pageSize);
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
            return Conflict("Ya existe un paciente con este número de teléfono.");
        }

        var PacienteT = new Pacientes
        {
            Nombre = paciente.Nombre,
            Apellido = paciente.Apellido,
            FechaNacimiento = paciente.FechaNacimiento,
            Telefono = paciente.Telefono,
            Email = paciente.Email
        };

        var nuevoPaciente = await _pacienteService.Crear(PacienteT);

        return CreatedAtAction(nameof(GetPacientes), new { id = nuevoPaciente.Id });
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<PacienteDTO>> Get(int id)
    {
        var paciente = await _pacienteService.ObtenerPorId(id);
      
        if (paciente == null) return NotFound();

        return Ok(paciente);    
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, [FromBody] PacienteDTO paciente)
    {
        try{


            if (paciente == null) return BadRequest();

            if (!ModelState.IsValid) return BadRequest(ModelState);

            var pacienteExistente = await _pacienteService.ObtenerPorId(id);
            
            if (pacienteExistente == null) return NotFound();

            var pacienteActualizado = new Pacientes
            {
                Id = id,
                Nombre = paciente.Nombre,
                Apellido = paciente.Apellido,
                FechaNacimiento = paciente.FechaNacimiento,
                Telefono = paciente.Telefono,
                Email = paciente.Email
            };

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