namespace Clinica.Services.IServices;

public interface IRepository
{
    Task<T?> GetByIdAsync<T>(int id, CancellationToken cancellationToken = default) where T : class;
    Task<IReadOnlyList<T>> GetAllAsync<T>(CancellationToken cancellationToken = default) where T : class;
    Task<IReadOnlyList<T>> GetAllOrderedAsync<T>(string propertyName, bool descending = false, CancellationToken cancellationToken = default) where T : class;
    Task<T> AddAsync<T>(T entity, CancellationToken cancellationToken = default) where T : class;
    Task UpdateAsync<T>(T entity, CancellationToken cancellationToken = default) where T : class;
    Task DeleteAsync<T>(T entity, CancellationToken cancellationToken = default) where T : class;
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
