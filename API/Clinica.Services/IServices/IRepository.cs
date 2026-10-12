using System.Linq.Expressions;

namespace Clinica.Services.IServices;

public interface IRepository<T> where T : class
{
        Task<T?> GetByIdAsync(int id, CancellationToken cancellationToken = default);
        Task<IReadOnlyList<T>> GetAllAsync(CancellationToken cancellationToken = default);
        Task<IReadOnlyList<T>> GetAllOrderedAsync(string propertyName, bool descending = false, CancellationToken cancellationToken = default);
        Task<T> AddAsync(T entity, CancellationToken cancellationToken = default);
        Task<bool> ExistsAsync(Expression<Func<T, bool>> predicate, CancellationToken cancellationToken = default);
        Task<IEnumerable<T>> AddRangeAsync(IEnumerable<T> entities, CancellationToken cancellationToken = default);
        Task UpdateAsync(T entity, CancellationToken cancellationToken = default);
        Task DeleteAsync(T entity, CancellationToken cancellationToken = default);
        Task DeleteByFilterAsync(Expression<Func<T, bool>> predicate, CancellationToken cancellationToken = default);
        Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);

        /// <summary>
        /// Obtiene una lista de elementos de la entidad T filtrados por un predicado y ordenados por una propiedad específica.
        /// </summary>
        /// <param name="predicate"> Predicado para filtrar los elementos </param>
        /// <param name="propertyName"> Nombre de la propiedad por la cual ordenar </param>
        /// <param name="descending"> Indica si el orden es descendente </param>
        /// <param name="includes"> Indica si se deben incluir relaciones </param>
        /// <param name="cancellationToken"> Token de cancelación </param>
        /// <returns></returns>
        Task<IReadOnlyList<T>> GetFilteredAndOrderedAsync(Expression<Func<T, bool>> predicate, 
                                                        string propertyName, 
                                                        bool descending = false, 
                                                        IEnumerable<Expression<Func<T, object>>>? includes = null,
                                                        CancellationToken cancellationToken = default);
        /// <summary>
        /// Obtiene un solo elemento de la entidad T proyectado a TResult según un predicado dado.
        /// </summary>
        /// <typeparam name="TResult"> Tipo a retornar </typeparam>
        /// <param name="selector"> Expresión que define la proyección </param>
        /// <param name="predicate"> Predicado para filtrar los elementos </param>
        /// <param name="cancellationToken"> Token de cancelación </param>
        /// <returns></returns>
        Task<TResult> GetSingleSelectedAsync<TResult>(
                Expression<Func<T, TResult>> selector,
                Expression<Func<T, bool>> predicate,
                CancellationToken cancellationToken = default);

        Task<IReadOnlyList<TResult>> GetGroupedAndAggregatedAsync<TKey, TResult>(
        Expression<Func<T, bool>> predicate,
        Expression<Func<T, TKey>> keySelector,
        Expression<Func<IGrouping<TKey, T>, TResult>> resultSelector, // <-- Proyección matemática
        CancellationToken cancellationToken = default);
}
