namespace Clinica.Core.DTOs.Resumenes
{
public class ResumenDto
{
    public CitasDto Citas { get; set; } = new CitasDto();
    public ReciboDto Recibo { get; set; } = new ReciboDto();    
    public PacientesDto Pacientes { get; set; } = new PacientesDto();


}
}