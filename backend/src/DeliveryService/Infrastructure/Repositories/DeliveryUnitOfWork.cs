using Microsoft.EntityFrameworkCore.Storage;
using DeliveryService.Data;
using DeliveryService.Domain.Interfaces;
using DeliveryService.Infrastructure.Repositories;
using System;
using System.Threading.Tasks;

namespace DeliveryService.Infrastructure.Repositories;

public class DeliveryUnitOfWork : IDeliveryUnitOfWork
{
    private readonly DeliveryDbContext _context;
    private IDbContextTransaction? _transaction;

    public DeliveryUnitOfWork(DeliveryDbContext context)
    {
        _context = context;
        Deliveries = new DeliveryRepository(_context);
        Riders = new RiderRepository(_context);
        Hubs = new HubRepository(_context);
    }

    public IDeliveryRepository Deliveries { get; }
    public IRiderRepository Riders { get; }
    public IHubRepository Hubs { get; }

    public async Task<int> SaveChangesAsync()
    {
        return await _context.SaveChangesAsync();
    }

    public async Task BeginTransactionAsync()
    {
        _transaction = await _context.Database.BeginTransactionAsync();
    }

    public async Task CommitTransactionAsync()
    {
        if (_transaction != null)
        {
            await _transaction.CommitAsync();
            await _transaction.DisposeAsync();
            _transaction = null;
        }
    }

    public async Task RollbackTransactionAsync()
    {
        if (_transaction != null)
        {
            await _transaction.RollbackAsync();
            await _transaction.DisposeAsync();
            _transaction = null;
        }
    }

    public void Dispose()
    {
        _transaction?.Dispose();
        _context.Dispose();
    }
}