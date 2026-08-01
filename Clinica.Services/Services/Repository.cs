using Clinica.Data;
using Clinica.Services.IServices;
using Microsoft.EntityFrameworkCore;

namespace Clinica.Services.Services;

public class Repository : IRepository
{
    private readonly ClinicaContext _context;

    public Repository(ClinicaContext context)
    {
        _context = context;
    }

    public async Task<T?> GetByIdAsync<T>(int id, CancellationToken cancellationToken = default) where T : class
    {
        return await _context.Set<T>().FindAsync(new object[] { id }, cancellationToken);
    }

    public async Task<IReadOnlyList<T>> GetAllAsync<T>(CancellationToken cancellationToken = default) where T : class
    {
        return await _context.Set<T>().AsNoTracking().ToListAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<T>> GetAllOrderedAsync<T>(string propertyName, bool descending = false, CancellationToken cancellationToken = default) where T : class
    {
        var query = _context.Set<T>().AsNoTracking().AsQueryable();
        var property = typeof(T).GetProperty(propertyName, System.Reflection.BindingFlags.IgnoreCase | System.Reflection.BindingFlags.Public | System.Reflection.BindingFlags.Instance);

        if (property is null)
        {
            throw new ArgumentException($"La propiedad '{propertyName}' no existe en {typeof(T).Name}.", nameof(propertyName));
        }

        var parameter = System.Linq.Expressions.Expression.Parameter(typeof(T), "x");
        var propertyAccess = System.Linq.Expressions.Expression.MakeMemberAccess(parameter, property);
        var orderExpression = System.Linq.Expressions.Expression.Lambda(propertyAccess, parameter);

        var methodName = descending ? "OrderByDescending" : "OrderBy";
        var method = typeof(Queryable).GetMethods()
            .First(m => m.Name == methodName && m.GetParameters().Length == 2)
            .MakeGenericMethod(typeof(T), property.PropertyType);

        var orderedQuery = (IQueryable<T>)method.Invoke(null, new object[] { query, orderExpression })!;
        return await orderedQuery.ToListAsync(cancellationToken);
    }

    public async Task<T> AddAsync<T>(T entity, CancellationToken cancellationToken = default) where T : class
    {
        _context.Set<T>().Add(entity);
        await _context.SaveChangesAsync(cancellationToken);
        return entity;
    }

    public async Task UpdateAsync<T>(T entity, CancellationToken cancellationToken = default) where T : class
    {
        _context.Set<T>().Update(entity);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task DeleteAsync<T>(T entity, CancellationToken cancellationToken = default) where T : class
    {
        _context.Set<T>().Remove(entity);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        return _context.SaveChangesAsync(cancellationToken);
    }
}

