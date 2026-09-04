using Clinica.Data;
using Clinica.Core.Models;
using Microsoft.EntityFrameworkCore;
using Clinica.Services.IServices;
using Clinica.Core.DTOs.Filters;
using Clinica.Core.DTOs.Pacientes;
using Clinica.Core.DTOs.Citas;
using Clinica.Core.DTOs.Recibo;

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

        public async Task<HistorialPacienteDto> DameHistorial(int id)
        {
            var paciente = await _context.Pacientes.AsNoTracking().FirstOrDefaultAsync(p => p.Id == id) ?? throw new Exception($"Paciente con ID {id} no encontrado.");
#pragma warning disable CS8602 // Dereference of a possibly null reference.
            paciente.ListaCitas = await _context.Citas.AsNoTracking()
                                                        .Include(c => c.TipoCita)
                                                        .Include(c => c.Recibo)
                                                        .Include(c => c.Recibo.Moneda)
                                                        .Include(c => c.EstadoCita)
                                                        .Where(c => c.PacienteId == id).ToListAsync();
#pragma warning restore CS8602 // Dereference of a possibly null reference.

            var Historial = new HistorialPacienteDto
            {
                Id = paciente.Id,
                Nombre = paciente.Nombre,
                Apellido = paciente.Apellido,
                FechaNacimiento = paciente.FechaNacimiento,
                Telefono = paciente.Telefono,
                Email = paciente.Email,
                Identificacion = paciente.Identificacion,
                FIngreso = paciente.FIngreso,
                Citas = [.. paciente.ListaCitas.Select(c => new CitaResumenDTO
                {
                    Id = c.Id,
                    TipoCitaId = c.TipoCitaId,
                    FechaInicio = c.FechaInicio,
                    FechaFin = c.FechaFin,
                    Observaciones = c.Observaciones,
                    EstadoCitaCodigo = c.EstadoCitaCodigo,
                    TipoCitaNombre = c.TipoCita?.NombreCita ?? string.Empty,
                    EstadoCitaDescripcion = c.EstadoCita?.Descripcion ?? string.Empty,
                    CitaRecibo = c.Recibo != null ? new ReciboDto
                    {
                        IdRecibo = c.Recibo.IdRecibo,
                        MontoNeto = c.Recibo.MontoNeto,
                        Observaciones = c.Recibo.Observaciones,
                        MedioPago = c.Recibo.MedioPago,
                        IdMoneda = c.Recibo.IdMoneda,
                        Moneda = c.Recibo.Moneda,
                        FIngreso = c.Recibo.FIngreso
                    } : null
                })],
                LastCitaDate = paciente.ListaCitas.Count != 0 ? paciente.ListaCitas.Max(c => c.FechaInicio) : DateTime.MinValue,
                MontoTotalPago = paciente.ListaCitas.Sum(c => c.Recibo != null ? c.Recibo.MontoNeto : 0)
            };  
            
            return Historial;
        }

    }
}