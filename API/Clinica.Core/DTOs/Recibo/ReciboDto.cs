using Clinica.Core.Models;

namespace Clinica.Core.DTOs.Recibo
{
    public class ReciboDto
    {         
        public int IdRecibo { get; set; }
        public decimal MontoNeto { get; set; }
        public string Observaciones { get; set; } = string.Empty;
        public short MedioPago { get; set; }       
        public int IdMoneda { get; set; }
        public virtual Moneda? Moneda { get; set; }
        public DateTime FIngreso { get; set; }       
    }
}