using Clinica.Core.DTOs.Filters;
using Clinica.Core.DTOs.Pacientes;
using Clinica.Core.Models;

namespace Clinica.Services.IServices;

public interface IPacienteService : IRepository<Pacientes>
{
    Task<PageResponse<Pacientes>>ObtenerTodos(PacienteFiltroDTO filtro);
    Task<Pacientes> Crear(Pacientes paciente);
    Task<Pacientes?> ObtenerPorId(int id);
    Task<HistorialPacienteDto> DameHistorial(int id);
    Task<List<Pacientes>> ObtenerPorId_NombreAsync(int? id, string? nombre);
    Pacientes AsignarDT(PacienteDTO paciente);
}