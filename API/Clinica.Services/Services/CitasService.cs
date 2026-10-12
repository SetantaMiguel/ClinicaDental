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
                    FechaInicio = c.FechaInicio,
                    FechaFin = c.FechaFin,
                    Observaciones = c.Observaciones,
                    PacienteNombre = c.Paciente != null ? c.Paciente.Nombre + " " + c.Paciente.Apellido : string.Empty,
                    TiposCita = c.TiposCita != null ? c.TiposCita.Select(tc => new CatalogoCita
                    {
                        IdTipoCita = tc.CatalogoCitaId,
                        TipoCitaNombre = tc.CatalogoCita != null ? tc.CatalogoCita.NombreCita : string.Empty
                    }).ToList() : new List<CatalogoCita>(),
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
                    } : null,
                    UsuarioCreacion = c.UsuarioCreacion
                }).ToListAsync(),
                TotalRecords = await _context.Citas.CountAsync()
            };
        }

        public async Task<PageResponse<CitaResumenDTO>> ObtenerTodos(CitaFiltroDto filtroDTO)
        {
            var citas = _context.Citas.AsQueryable();

            if (filtroDTO.FechaDesde.HasValue)
            {
                var fechaDesde = filtroDTO.FechaDesde.Value.Date;
                citas = citas.Where(c => c.FechaInicio >= fechaDesde);
            }

            if (filtroDTO.FechaHasta.HasValue)
            {
                var fechaHastaExclusiva = filtroDTO.FechaHasta.Value.Date.AddDays(1);
                citas = citas.Where(c => c.FechaInicio < fechaHastaExclusiva);
            }

            if (!string.IsNullOrWhiteSpace(filtroDTO.PacienteNombre))
            {
                var nombrePaciente = filtroDTO.PacienteNombre.Trim();
                citas = citas.Where(c => c.Paciente != null &&
                    EF.Functions.ILike(c.Paciente.Nombre + " " + c.Paciente.Apellido, $"%{nombrePaciente}%"));
            }

            if (!string.IsNullOrWhiteSpace(filtroDTO.EstadoCitaCodigo))
            {
                citas = citas.Where(c => c.EstadoCitaCodigo == filtroDTO.EstadoCitaCodigo);
            }

            if (filtroDTO.TipoCitaId.HasValue)
            {
                citas = citas.Where(c => c.TiposCita.Any(tc => tc.CatalogoCitaId == filtroDTO.TipoCitaId.Value));
            }

            var query = citas.OrderByDescending(c => c.Id).Select(c => new CitaResumenDTO
            {
                Id = c.Id,
                PacienteId = c.PacienteId,
                //TipoCitaId = c.TipoCitaId,
                FechaInicio = c.FechaInicio,
                FechaFin = c.FechaFin,
                Observaciones = c.Observaciones,
                PacienteNombre = c.Paciente != null ? c.Paciente.Nombre + " " + c.Paciente.Apellido : string.Empty,
                TiposCita = c.TiposCita != null ? c.TiposCita.Select(tc => new CatalogoCita
                {
                    IdTipoCita = tc.CatalogoCitaId,
                    TipoCitaNombre = tc.CatalogoCita != null ? tc.CatalogoCita.NombreCita : string.Empty
                }).ToList() : new List<CatalogoCita>(),
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
                } : null,
                UsuarioCreacion = c.UsuarioCreacion
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