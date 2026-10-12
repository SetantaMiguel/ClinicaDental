using Clinica.Core.Models;
using Clinica.Data;
using Clinica.Services.IServices;
using Microsoft.EntityFrameworkCore;

namespace Clinica.Services.Services
{
    public class ServiceCitaDetalleCatalogo(ClinicaContext context) : Repository<CitaDetalleCatalogo>(context), IServiceCitaDetalleCatalogo
    {
        public async Task<bool> ReemplazarTiposAsync(
            int citaId,
            IReadOnlyCollection<int> tiposCitaIds,
            CancellationToken cancellationToken = default)
        {
            var idsUnicos = tiposCitaIds.Distinct().ToArray();
            var tiposExistentes = await _context.CatalogoCitas
                .Where(tipo => idsUnicos.Contains(tipo.Id))
                .Select(tipo => tipo.Id)
                .ToListAsync(cancellationToken);

            if (tiposExistentes.Count != idsUnicos.Length)
            {
                return false;
            }

            var tiposActuales = await _context.CitaDetallesCatalogo
                .Where(detalle => detalle.CitaId == citaId)
                .ToListAsync(cancellationToken);

            _context.CitaDetallesCatalogo.RemoveRange(tiposActuales);

            await _context.CitaDetallesCatalogo.AddRangeAsync(idsUnicos.Select(tipoId => new CitaDetalleCatalogo
            {
                CitaId = citaId,
                CatalogoCitaId = tipoId
            }), cancellationToken);

            await _context.SaveChangesAsync(cancellationToken);
            return true;
        }
    }
}