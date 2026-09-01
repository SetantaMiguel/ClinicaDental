namespace Clinica.Core.DTOs.Resumenes
{
    public class TotalMonedaDto
    {
        public int IdMoneda { get; set; } = 0;

        public decimal SumaTotal { get; set; } = 0;

        public decimal ChangeMes {get;set;} = 0;
        public string Moneda { get; set; } = string.Empty;
    }
}