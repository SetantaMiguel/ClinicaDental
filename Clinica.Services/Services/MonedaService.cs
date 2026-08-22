using Clinica.Core.Models;
using Clinica.Data;
using Clinica.Services.IServices;

namespace Clinica.Services.Services
{
    public class MonedaService(ClinicaContext context) : Repository<Moneda>(context), IMonedaService
    {
        
    }
}