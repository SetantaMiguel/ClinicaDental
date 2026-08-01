using Clinica.Core.Models;

namespace Clinica.Services.IServices;

public interface ICatalogoCitaService
{
    Task<IReadOnlyList<CatalogoCitas>> ObtenerTodosAsync();
    Task<CatalogoCitas?> ObtenerPorIdAsync(int id);
    Task<CatalogoCitas> CrearAsync(CatalogoCitas catalogoCita);
    Task ActualizarAsync(CatalogoCitas catalogoCita);
    Task EliminarAsync(int id);
}
