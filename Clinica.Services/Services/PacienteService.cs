using Clinica.Data;
using Clinica.Core.Models;
using Microsoft.EntityFrameworkCore;
using Clinica.Services.IServices;
using Clinica.Core.DTOs.Filters;

namespace Clinica.Services;

public class PacienteService : IPacienteService
{
    private readonly ClinicaContext _context;

    public PacienteService(ClinicaContext context)
    {
        _context = context;
    }

    public async Task<PageResponse<Pacientes>> ObtenerTodos(PacienteFiltroDTO filtroDTO) 
    {
        var query = _context.Pacientes.AsQueryable();
       
        if (!string.IsNullOrEmpty(filtroDTO.Nombre))
        {
            query = query.Where(p => p.Nombre.Contains(filtroDTO.Nombre));
        }
          
        if (!string.IsNullOrEmpty(filtroDTO.Apellido))
        {
            query = query.Where(p => p.Apellido.Contains(filtroDTO.Apellido));
        }
        
        return new()
        {
            Data = await query.Skip((filtroDTO.PageNumber - 1) * filtroDTO.PageSize)
                .Take(filtroDTO.PageSize).ToListAsync(),
            PageNumber = filtroDTO.PageNumber,
            PageSize = filtroDTO.PageSize,
            TotalRecords = await query.CountAsync()
        };

    }
        
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