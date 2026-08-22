using Clinica.Core.DTOs.CitasDTOS;
using Clinica.Core.Models;

namespace Clinica.Services.IServices
{
    public interface ICitasService : IRepository<Citas>
    {
        Task<PageResponse<CitaResumenDTO>>ObtenerTodos();

    }
}