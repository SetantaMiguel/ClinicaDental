using System.Linq.Expressions;

namespace Clinica.Services.IServices;

public interface IRepository<T> where T : class
{
        Task<T?> GetByIdAsync(int id, CancellationToken cancellationToken = default);
        Task<IReadOnlyList<T>> GetAllAsync(CancellationToken cancellationToken = default);
        Task<IReadOnlyList<T>> GetAllOrderedAsync(string propertyName, bool descending = false, CancellationToken cancellationToken = default);
        Task<T> AddAsync(T entity, CancellationToken cancellationToken = default);
        Task UpdateAsync(T entity, CancellationToken cancellationToken = default);
        Task DeleteAsync(T entity, CancellationToken cancellationToken = default);
        Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
        Task<IReadOnlyList<T>> GetFilteredAndOrderedAsync(Expression<Func<T, bool>> predicate, 
                                                        string propertyName, 
                                                        bool descending = false, 
                                                        CancellationToken cancellationToken = default);

        Task<TResult> GetSingleSelectedAsync<TResult>(
                Expression<Func<T, TResult>> selector,
                Expression<Func<T, bool>> predicate,
                CancellationToken cancellationToken = default);
}
