using Clinica.Core.Models;

namespace Clinica.Services.IServices
{
    public interface IServiceCitaDetalleCatalogo: IRepository<CitaDetalleCatalogo>
    {
        Task<bool> ReemplazarTiposAsync(int citaId, IReadOnlyCollection<int> tiposCitaIds, CancellationToken cancellationToken = default);
    }
}