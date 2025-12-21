using Microsoft.EntityFrameworkCore;
using Shared.Infrastructure.Repositories;
using Shared.Models;
using UserService.Data;
using UserService.Domain.Interfaces;
using System.Threading.Tasks;

namespace UserService.Infrastructure.Repositories;

public class UserRepository : Repository<User>, IUserRepository
{
    public UserRepository(UserDbContext context) : base(context) { }

    public async Task<User?> GetByEmailAsync(string email)
    {
        return await _dbSet.FirstOrDefaultAsync(u => u.Email == email);
    }
}

public class UserUnitOfWork : UnitOfWork, IUserUnitOfWork
{
    private readonly UserDbContext _context;
    private IUserRepository? _users;

    public UserUnitOfWork(UserDbContext context) : base(context)
    {
        _context = context;
    }

    public IUserRepository Users => _users ??= new UserRepository(_context);
}