using Clinica.Core.Models;
using Clinica.Services.IServices;

namespace Clinica.Services.Services;

public class CatalogoCitaService : ICatalogoCitaService
{
    private readonly IRepository _repository;

    public CatalogoCitaService(IRepository repository)
    {
        _repository = repository;
    }

    public async Task<IReadOnlyList<CatalogoCitas>> ObtenerTodosAsync()
    {
        return await _repository.GetAllOrderedAsync<CatalogoCitas>(nameof(CatalogoCitas.Id), false);
    }

    public async Task<CatalogoCitas?> ObtenerPorIdAsync(int id)
    {
        return await _repository.GetByIdAsync<CatalogoCitas>(id);
    }

    public async Task<CatalogoCitas> CrearAsync(CatalogoCitas catalogoCita)
    {
        return await _repository.AddAsync(catalogoCita);
    }

    public async Task ActualizarAsync(CatalogoCitas catalogoCita)
    {
        await _repository.UpdateAsync(catalogoCita);
    }

    public async Task EliminarAsync(int id)
    {
        var item = await _repository.GetByIdAsync<CatalogoCitas>(id);
        if (item is not null)
        {
            await _repository.DeleteAsync(item);
        }
    }
}
