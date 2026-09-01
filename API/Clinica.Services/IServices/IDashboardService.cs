namespace Clinica.Services.IServices
{
    public interface IDashboardService
    {
        Task<object> DameResumen(int aniomes);
        
    }
}