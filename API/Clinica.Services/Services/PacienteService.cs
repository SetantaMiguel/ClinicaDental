using Clinica.Data;
using Clinica.Core.Models;
using Microsoft.EntityFrameworkCore;
using Clinica.Services.IServices;
using Clinica.Core.DTOs.Filters;
using Clinica.Core.DTOs;

namespace Clinica.Services.Services
{
    public class PacienteService(ClinicaContext context) : Repository<Pacientes>(context), IPacienteService
    {
        public async Task<PageResponse<Pacientes>> ObtenerTodos(PacienteFiltroDTO filtroDTO)
        {
            var query = _context.Pacientes.AsQueryable();

            if (!string.IsNullOrEmpty(filtroDTO.Nombre))
            {
                query = query.Where(p => EF.Functions.ILike(p.Nombre, $"{filtroDTO.Nombre}%"));
            }

            if (!string.IsNullOrEmpty(filtroDTO.Apellido))
            {
                query = query.Where(p => EF.Functions.ILike(p.Apellido, $"{filtroDTO.Apellido}%"));
            }

            return new()
            {
                Data = await query.OrderBy(p => p.Id).Skip((filtroDTO.PageNumber - 1) * filtroDTO.PageSize)
                    .Take(filtroDTO.PageSize).ToListAsync(),
                PageNumber = filtroDTO.PageNumber,
                PageSize = filtroDTO.PageSize,
                TotalRecords = await query.CountAsync()
            };

        }
        public async Task<Pacientes> Crear(Pacientes paciente)
        {
            return await AddAsync(paciente);
        }
        public async Task<Pacientes?> ObtenerPorId(int id)
        {
            var paciente = await _context.Pacientes.AsNoTracking().FirstOrDefaultAsync(p => p.Id == id);
            return paciente;
        }
        public async Task<List<Pacientes>> ObtenerPorId_NombreAsync(int? id, string? nombre)
        {
            var query = _context.Pacientes.AsNoTracking();

            if (id.HasValue && id.Value > 0)
            {
                query = query.Where(p => p.Id == id.Value);
            }

            if (!string.IsNullOrWhiteSpace(nombre))
            {
                query = query.Where(p => p.Nombre.ToUpper().StartsWith(nombre.ToUpper()));
            }

            return await query.ToListAsync();
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
                Identificacion = paciente.Identificacion,
                FIngreso = DateTime.Now
            };

            return PacienteT;
        }

    }
}