using System.Linq.Expressions;
using Clinica.Data;
using Clinica.Services.IServices;
using Microsoft.EntityFrameworkCore;

namespace Clinica.Services.Services;

public class Repository<T> : IRepository<T> where T : class
{
    protected readonly ClinicaContext _context;
    protected readonly DbSet<T> _dbSet;

    public Repository(ClinicaContext context)
    {
        _context = context;
        _dbSet = _context.Set<T>();
    }
    public async Task<T?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        return await _dbSet.FindAsync(new object[] { id }, cancellationToken);
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
        
        query = ApplyOrdering(query,propertyName,descending);
        
        return await query.ToListAsync(cancellationToken);
    }

    public async Task<T> AddAsync(T entity, CancellationToken cancellationToken = default)
    {
        _dbSet.Add(entity);
        await _context.SaveChangesAsync(cancellationToken);
        return entity;
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

    public Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        return _context.SaveChangesAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<T>> GetFilteredAndOrderedAsync(
        Expression<Func<T, bool>> predicate, 
        string propertyName, 
        bool descending = false, 
        CancellationToken cancellationToken = default)
    {
        // 1. Iniciamos la consulta y aplicamos el filtro (Where)
        IQueryable<T> query = _context.Set<T>().Where(predicate);

        // 2. Aplicamos el ordenamiento (reutiliza la lógica que ya tienes en tu otro método)
        // Ejemplo si usas System.Linq.Dynamic.Core:
        // string orderExpression = $"{propertyName} {(descending ? "DESC" : "ASC")}";
        // query = query.OrderBy(orderExpression);
        
        // Alternativa manual con Expressions si no usas librerías extra:
        query = Repository<T>.ApplyOrdering(query, propertyName, descending);

        // 3. Ejecutamos y retornamos la lista
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

