using System.Data.Common;
using Clinica.Core.DTOs;
using Clinica.Core.DTOs.Resumenes;
using Clinica.Core.Models;
using Clinica.Services.IServices;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace Clinica.Services.Services
{
    public class DashboardService(ICitaReciboService citaReciboService
    , ICitasService citasService
    , IPacienteService pacienteService) : IDashboardService
    {
        // Usando los parámetros del Primary Constructor (C# 12) directamente como campos privados.
        private readonly ICitaReciboService _citaRecibo = citaReciboService;
        private readonly ICitasService _citas = citasService;
        private readonly IPacienteService _pacientes = pacienteService;

        // Asumo que quieres retornar un objeto u otra estructura en lugar de void (Task)
        public async Task<object> DameResumen(int aniomes)
        {
            // 1. Extraer el año y el mes usando matemáticas simples (Ej: 202608)
            int year = aniomes / 100;      // 202608 / 100 = 2026
            int month = aniomes % 100;     // 202608 % 100 = 8

            // 2. Crear las fechas límite del mes
            var fechaInicioMes = new DateTime(year, month, 1);
            var fechaFinMes = fechaInicioMes.AddMonths(1);


            var fechaInicioMesAnterior = fechaInicioMes.AddMonths(-1);
            var fechaFinMesAnterior = fechaInicioMes;

            // 3. Listamos resumenes agrupados.
            var CantMes = (await _citas.GetGroupedAndAggregatedAsync(c =>
                            c.FechaInicio >= fechaInicioMes && c.FechaFin < fechaFinMes,
                            c => 1 == 1,
                            c => c.Count())).FirstOrDefault();


            var ReciboXMes = await _citaRecibo.GetGroupedAndAggregatedAsync(c =>
                                c.Cita!.FechaInicio >= fechaInicioMes && c.Cita!.FechaFin < fechaFinMes,
                                c => c.IdMoneda,
                                c => new TotalMonedaDto
                                {
                                    IdMoneda = c.Key,
                                    SumaTotal = c.Sum(p => p.MontoNeto),
                                    Moneda = c.First().Moneda!.MonedaSimbolo
                                });

            var PacienteXMes = (await _pacientes.GetGroupedAndAggregatedAsync(c =>
                c.FIngreso >= fechaInicioMes && c.FIngreso < fechaFinMes,
                c => 1 == 1,
                c => c.Count())).FirstOrDefault();

            // Datos del mes anterior
            var CantMesAnterior = (await _citas.GetGroupedAndAggregatedAsync(c =>
                            c.FechaInicio >= fechaInicioMesAnterior && c.FechaInicio < fechaFinMesAnterior,
                            c => 1 == 1,
                            c => c.Count())).FirstOrDefault();


            var PacienteXMesAnterior = (await _pacientes.GetGroupedAndAggregatedAsync(c =>
                c.FIngreso >= fechaInicioMesAnterior && c.FIngreso < fechaFinMesAnterior,
                c => 1 == 1,
                c => c.Count())).FirstOrDefault();

            // 4.  Calculamos
            double CitasChange = CalcularPorcentaje(CantMes,CantMesAnterior); // Valor por defecto
            double PacientesChange = CalcularPorcentaje(PacienteXMes,PacienteXMesAnterior); // Valor por defecto

            var ReciboXMesAnterior = await _citaRecibo.GetGroupedAndAggregatedAsync(c =>
                                c.Cita!.FechaInicio >= fechaInicioMesAnterior && c.Cita!.FechaFin < fechaFinMesAnterior,
                                c => c.IdMoneda,
                                c => new TotalMonedaDto
                                {
                                    IdMoneda = c.Key,
                                    SumaTotal = c.Sum(p => p.MontoNeto),
                                    Moneda = c.First().Moneda!.MonedaSimbolo
                                });

            foreach (var item in ReciboXMes)
            {
                var a = ReciboXMesAnterior.FirstOrDefault(c => c.IdMoneda == item.IdMoneda);

                if (a != null && a!.SumaTotal != 0)
                {
                    item.ChangeMes = Math.Round((item.SumaTotal - a.SumaTotal) / a.SumaTotal * 100, 2, MidpointRounding.AwayFromZero);
                }
                else if (item.SumaTotal > 0)
                {
                    item.ChangeMes = 100;
                }
            }

            var Resumen = new ResumenDto
            {
                Citas = new CitasDto { Total = CantMes,PorcentajeCitasMes=CitasChange },
                Recibo = new ReciboDto
                {
                    TotalMonedas = [.. ReciboXMes]
                },
                Pacientes = new PacientesDto { Total=PacienteXMes,PorcentajePacientesMes = PacientesChange }                
            };

            return Resumen;
        }

        private static double CalcularPorcentaje(double actual, double anterior)
        {

            if (anterior > 0)
            {
                return Math.Round((actual - anterior) / anterior * 100, 2, MidpointRounding.AwayFromZero);
            }
            return actual > 0 ? actual : 0;
        }
    }
}