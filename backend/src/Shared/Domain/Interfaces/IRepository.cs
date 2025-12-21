using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Shared.Models;

namespace Shared.Domain.Interfaces;

public interface IRepository<T> where T : class
{
    Task<T?> GetByIdAsync(string id);
    Task<IEnumerable<T>> GetAllAsync();
    Task<PagedList<T>> GetPagedAsync(int page, int pageSize);
    Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate);
    Task<PagedList<T>> FindPagedAsync(Expression<Func<T, bool>> predicate, int page, int pageSize);
    Task<T> AddAsync(T entity);
    Task UpdateAsync(T entity);
    Task DeleteAsync(T entity);
}

public interface IUnitOfWork : IDisposable
{
    Task<int> SaveChangesAsync();
    Task BeginTransactionAsync();
    Task CommitTransactionAsync();
    Task RollbackTransactionAsync();
}