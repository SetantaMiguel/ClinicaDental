using Clinica.Core.Models;
using Clinica.Data;
using Clinica.Services.IServices;

namespace Clinica.Services.Services;

public class CatalogoCitaService(ClinicaContext context) : Repository<CatalogoCitas>(context), ICatalogoCitaService
{
    public async Task<IReadOnlyList<CatalogoCitas>> ObtenerTodosAsync()
    {
        return await GetAllOrderedAsync(nameof(CatalogoCitas.Id), false);
    }

    public async Task EliminarAsync(int id)
    {
        var item = await GetByIdAsync(id);
        if (item is not null)
        {
            await DeleteAsync(item);
        }
    }
}
