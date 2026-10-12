using System.Linq.Expressions;
using Clinica.Data;
using Clinica.Services.IServices;
using Microsoft.EntityFrameworkCore;

namespace Clinica.Services.Services;

public class Repository<T> : IRepository<T> where T : class
{
    public readonly ClinicaContext _context;
    protected readonly DbSet<T> _dbSet;

    public Repository(ClinicaContext context)
    {
        _context = context;
        _dbSet = _context.Set<T>();
    }
    public async Task<bool> ExistsAsync(Expression<Func<T, bool>> predicate, CancellationToken cancellationToken = default)
    {
        return await _dbSet.AnyAsync(predicate, cancellationToken);
    }

    public async Task<T?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        return await _dbSet.FindAsync([id], cancellationToken);
    }

    public async Task<IReadOnlyList<T>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await _dbSet.AsNoTracking().ToListAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<T>> GetAllOrderedAsync(string propertyName, bool descending = false, CancellationToken cancellationToken = default)
    {
        var query = _dbSet.AsNoTracking().AsQueryable();
        var property = typeof(T).GetProperty(propertyName, System.Reflection.BindingFlags.IgnoreCase | System.Reflection.BindingFlags.Public | System.Reflection.BindingFlags.Instance);

        if (property is null)
        {
            throw new ArgumentException($"La propiedad '{propertyName}' no existe en {typeof(T).Name}.", nameof(propertyName));
        }

        query = ApplyOrdering(query, propertyName, descending);

        return await query.ToListAsync(cancellationToken);
    }

    public async Task<T> AddAsync(T entity, CancellationToken cancellationToken = default)
    {
        _dbSet.Add(entity);
        await _context.SaveChangesAsync(cancellationToken);
        return entity;
    }

    public async Task<IEnumerable<T>> AddRangeAsync(IEnumerable<T> entities, CancellationToken cancellationToken = default)
    {
        _dbSet.AddRange(entities);
        await _context.SaveChangesAsync(cancellationToken);
        return entities;
    }

    public async Task UpdateAsync(T entity, CancellationToken cancellationToken = default)
    {
        _dbSet.Update(entity);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task DeleteAsync(T entity, CancellationToken cancellationToken = default)
    {
        _dbSet.Remove(entity);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task DeleteByFilterAsync(Expression<Func<T, bool>> predicate, CancellationToken cancellationToken = default)
    {
        var entitiesToDelete = await _dbSet.Where(predicate).ToListAsync(cancellationToken);
        _dbSet.RemoveRange(entitiesToDelete);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        return _context.SaveChangesAsync(cancellationToken);
    }
    /// <summary>
    /// Obtiene una lista de elementos de la entidad T filtrados por un predicado y ordenados por una propiedad específica.
    /// </summary>
    /// <param name="predicate"> Predicado para filtrar los elementos </param>
    /// <param name="propertyName"> Nombre de la propiedad por la cual ordenar </param>
    /// <param name="descending"> Indica si el orden es descendente </param>
    /// <param name="includes"> Indica si se deben incluir relaciones </param>
    /// <param name="cancellationToken"> Token de cancelación </param>
    /// <returns></returns>
    public async Task<IReadOnlyList<T>> GetFilteredAndOrderedAsync(
        Expression<Func<T, bool>> predicate,
        string propertyName,
        bool descending = false,
        IEnumerable<Expression<Func<T, object>>>? includes = null,
        CancellationToken cancellationToken = default)
    {
        IQueryable<T> query = _context.Set<T>()
            .Where(predicate);

        // Includes dinámicos
        if (includes != null)
        {
            foreach (var include in includes)
            {
                query = query.Include(include);
            }
        }

        // Ordenamiento
        query = Repository<T>.ApplyOrdering(
            query,
            propertyName,
            descending
        );

        return await query.ToListAsync(cancellationToken);
    }
    public async Task<TResult> GetSingleSelectedAsync<TResult>(
        Expression<Func<T, TResult>> selector,
        Expression<Func<T, bool>> predicate,
        CancellationToken cancellationToken = default)
    {
#pragma warning disable CS8603 // Possible null reference return.
        return await _context.Set<T>()
            .Where(predicate)
            .Select(selector)
            .FirstOrDefaultAsync(cancellationToken);
#pragma warning restore CS8603 // Possible null reference return.
    }
    public async Task<IReadOnlyList<TResult>> GetGroupedAndAggregatedAsync<TKey, TResult>(
        Expression<Func<T, bool>> predicate,
        Expression<Func<T, TKey>> keySelector,
        Expression<Func<IGrouping<TKey, T>, TResult>> resultSelector,
        CancellationToken cancellationToken = default)
    {
        // 1. Filtramos
        IQueryable<T> query = _context.Set<T>().Where(predicate);

        // 2. Agrupamos y aplicamos las funciones (Count, Sum, Max)
        // Al usar Select justo después de GroupBy, EF Core lo traduce a un "GROUP BY" real en SQL
        IQueryable<TResult> groupedQuery = query
            .GroupBy(keySelector)
            .Select(resultSelector);

        // 3. Ejecutamos y retornamos
        return await groupedQuery.ToListAsync(cancellationToken);
    }
    private static IQueryable<T> ApplyOrdering(IQueryable<T> query, string propertyName, bool descending)
    {
        if (string.IsNullOrWhiteSpace(propertyName)) return query;

        var parameter = Expression.Parameter(typeof(T), "x");
        var property = Expression.Property(parameter, propertyName);
        var lambda = Expression.Lambda(property, parameter);

        string methodName = descending ? "OrderByDescending" : "OrderBy";

        var methodCallExpression = Expression.Call(
            typeof(Queryable),
            methodName,
            [typeof(T), property.Type],
            query.Expression,
            Expression.Quote(lambda));

        return query.Provider.CreateQuery<T>(methodCallExpression);
    }
}

