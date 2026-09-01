using Clinica.Core.DTOs.Citas;
using Clinica.Core.DTOs.Filters;
using Clinica.Core.Models;

namespace Clinica.Services.IServices
{
    public interface ICitasService : IRepository<Citas>
    {
        Task<PageResponse<CitaResumenDTO>> ObtenerTodos(PacienteFiltroDTO filtroDTO);
        
        Task<PageResponse<CitaResumenDTO>> ObtenerRecientes();

    }
}