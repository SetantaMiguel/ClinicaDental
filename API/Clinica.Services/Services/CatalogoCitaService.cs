using Clinica.Core.DTOs.Filters;
using Clinica.Core.Models;
using Clinica.Data;
using Clinica.Services.IServices;
using Microsoft.EntityFrameworkCore;

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

    public async Task<PageResponse<CatalogoCitas>> ObtenerTodos(CatalogoDeCitaDto filtro)
    {
        var query = _context.CatalogoCitas.AsQueryable();

        if (!string.IsNullOrEmpty(filtro.NombreCita))
        {
            query = query.Where(c => EF.Functions.ILike(c.NombreCita.ToUpper(), $"%{filtro.NombreCita.ToUpper()}%"));
        }

        if (!string.IsNullOrEmpty(filtro.Descripcion))
        {
            // Limpiamos espacios en blanco y preparamos el comodín
            var terminoBusqueda = $"%{filtro.Descripcion.Trim()}%";

            // Usamos ILike directamente sobre la propiedad original
            query = query.Where(c => EF.Functions.ILike(c.Descripcion, terminoBusqueda));
        }

        if (filtro.PrecioBase > 0)
        {
            query = query.Where(c => c.PrecioBase == filtro.PrecioBase);
        }

        if (filtro.Vigente is not null)
        {
            query = query.Where(c => c.Vigente == filtro.Vigente);
        }

        return new()
        {
            Data = await query.OrderBy(c => c.Id)
                .Skip((filtro.PageNumber - 1) * filtro.PageSize)
                .Take(filtro.PageSize)
                .ToListAsync(),
            PageNumber = filtro.PageNumber,
            PageSize = filtro.PageSize,
            TotalRecords = await query.CountAsync()
        };
    }
}
