using Clinica.Core.DTOs.Filters;
using Clinica.Core.Models;

namespace Clinica.Services.IServices;

public interface IPacienteService
{
    Task<PageResponse<Pacientes>>ObtenerTodos(PacienteFiltroDTO filtro);

    Task<Pacientes> Crear(Pacientes paciente);
    Task<Pacientes?> ObtenerPorId(int id);
}