using Clinica.Data;
using Clinica.Core.Models;
using Microsoft.EntityFrameworkCore;
using Clinica.Services.IServices;

namespace Clinica.Services;

public class PacienteService : IPacienteService
{
    private readonly ClinicaContext _context;

    public PacienteService(ClinicaContext context)
    {
        _context = context;
    }

    public async Task<PageResponse<Pacientes>> ObtenerTodos(int pageNumber, int pageSize) 
        => new()
        {
            Data = await _context.Pacientes
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync(),
            PageNumber = pageNumber,
            PageSize = pageSize,
            TotalRecords = await _context.Pacientes.CountAsync()
        };
        
    public async Task<Pacientes> Crear(Pacientes paciente)
    {

        _context.Pacientes.Add(paciente);
        await _context.SaveChangesAsync();
        return paciente;
    }
    public async Task<Pacientes?> ObtenerPorId(int id)
    {
        var paciente = await _context.Pacientes.AsNoTracking().FirstOrDefaultAsync(p => p.Id == id);
        return paciente;
    }
}