using Clinica.Core.Models;

namespace Clinica.Services.IServices;

public interface IPacienteService
{
    Task<PageResponse<Pacientes>>ObtenerTodos(int pageNumber, int pageSize);

    Task<Pacientes> Crear(Pacientes paciente);
    Task<Pacientes?> ObtenerPorId(int id);
}