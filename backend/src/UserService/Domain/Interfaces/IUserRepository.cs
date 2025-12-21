using Shared.Domain.Interfaces;
using System;
using System.Threading.Tasks;
using Shared.Models;

namespace UserService.Domain.Interfaces;

public interface IUserRepository : IRepository<User>
{
    Task<User?> GetByEmailAsync(string email);
}

public interface IUserUnitOfWork : IUnitOfWork
{
    IUserRepository Users { get; }
}