using Clinica.Core.Models;
using Clinica.Data;
using Clinica.Services.IServices;

namespace Clinica.Services.Services
{
    public class CitaReciboService(ClinicaContext context) : Repository<CitaRecibo>(context), ICitaReciboService
    {
        
    }
}