using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Shared.Models;
using Shared.Domain.Interfaces;

namespace DeliveryService.Domain.Interfaces;

public interface IDeliveryRepository : IRepository<Delivery>
{
    Task<IEnumerable<Delivery>> GetByRiderIdAsync(string riderId);
    Task<PagedList<Delivery>> GetPagedAsync(PaginationRequest request, string? riderId = null);
}

public interface IRiderRepository : IRepository<Rider>
{
    Task<IEnumerable<Rider>> GetAvailableRidersAsync(string? region = null);
    Task<IEnumerable<Rider>> GetByRegionAsync(string region);
}

public interface IHubRepository : IRepository<Hub>
{
    Task<Hub?> GetByStateAsync(string state);
}

public interface IDeliveryUnitOfWork : IDisposable
{
    IDeliveryRepository Deliveries { get; }
    IRiderRepository Riders { get; }
    IHubRepository Hubs { get; }
    Task<int> SaveChangesAsync();
    Task BeginTransactionAsync();
    Task CommitTransactionAsync();
    Task RollbackTransactionAsync();
}