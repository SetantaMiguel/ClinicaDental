using Clinica.Core.DTOs.Citas;
using Clinica.Core.DTOs.Filters;
using Clinica.Core.DTOs.Recibo;
using Clinica.Core.Models;
using Clinica.Data;
using Clinica.Services.IServices;
using Microsoft.EntityFrameworkCore;

namespace Clinica.Services.Services
{
    public class CitasService(ClinicaContext context) : Repository<Citas>(context), ICitasService
    {
        public async Task<PageResponse<CitaResumenDTO>> ObtenerRecientes()
        {

            return new PageResponse<CitaResumenDTO>
            {
                Data = await _context.Citas.Where(c => c.FechaInicio >= DateTime.UtcNow).OrderBy(c => c.FechaInicio).Take(5).Select(c => new CitaResumenDTO
                {
                    Id = c.Id,
                    PacienteId = c.PacienteId,
                    TipoCitaId = c.TipoCitaId,
                    FechaInicio = c.FechaInicio,
                    FechaFin = c.FechaFin,
                    Observaciones = c.Observaciones,
                    PacienteNombre = c.Paciente != null ? c.Paciente.Nombre + " " + c.Paciente.Apellido : string.Empty,
                    TipoCitaNombre = c.TipoCita != null ? c.TipoCita.NombreCita : string.Empty,
                    EstadoCitaCodigo = c.EstadoCitaCodigo,
                    EstadoCitaDescripcion = c.EstadoCita != null ? c.EstadoCita.Descripcion : string.Empty,
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
                }).ToListAsync(),
                TotalRecords = await _context.Citas.CountAsync()
            };
        }

        public async Task<PageResponse<CitaResumenDTO>> ObtenerTodos(PacienteFiltroDTO filtroDTO)
        {
            var query = _context.Citas.OrderByDescending(c => c.Id).Select(c => new CitaResumenDTO
            {
                Id = c.Id,
                PacienteId = c.PacienteId,
                TipoCitaId = c.TipoCitaId,
                FechaInicio = c.FechaInicio,
                FechaFin = c.FechaFin,
                Observaciones = c.Observaciones,
                PacienteNombre = c.Paciente != null ? c.Paciente.Nombre + " " + c.Paciente.Apellido : string.Empty,
                TipoCitaNombre = c.TipoCita != null ? c.TipoCita.NombreCita : string.Empty,
                EstadoCitaCodigo = c.EstadoCitaCodigo,
                EstadoCitaDescripcion = c.EstadoCita != null ? c.EstadoCita.Descripcion : string.Empty,
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
            });

            if (filtroDTO.PageSize == 0)
            {
                return new PageResponse<CitaResumenDTO>
                {
                    Data = await query.ToListAsync(),
                    TotalRecords = await query.CountAsync()
                };
            }
            
            return new PageResponse<CitaResumenDTO>
            {
                Data = await query.Skip((filtroDTO.PageNumber - 1) * filtroDTO.PageSize).Take(filtroDTO.PageSize).ToListAsync(),
                PageNumber = filtroDTO.PageNumber,
                PageSize = filtroDTO.PageSize,
                TotalRecords = await query.CountAsync()
            };
        }
    }
}