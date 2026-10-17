using Clinica.Core.DTOs.Filters;
using Clinica.Core.Models;

namespace Clinica.Services.IServices;

public interface ICatalogoCitaService : IRepository<CatalogoCitas>
{
    Task<PageResponse<CatalogoCitas>>ObtenerTodos(CatalogoDeCitaDto filtro);
}
