using Shared.Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Shared.Models;

namespace ItemService.Domain.Interfaces;

public interface IItemRepository : IRepository<Item>
{
    Task<IEnumerable<Item>> GetByStatusAsync(ItemStatus status);
    Task<IEnumerable<Item>> GetByStateAsync(string state);
    Task<PagedList<Item>> GetPagedByBatchIdAsync(string batchId, PaginationRequest request);
    Task<PagedList<Item>> GetPagedAsync(PaginationRequest request, string? status = null, string? state = null);
}

public interface IBatchRepository : IRepository<Batch>
{
    Task<IEnumerable<Batch>> GetByClientIdAsync(string clientId);
    Task<PagedList<Batch>> GetPagedAsync(PaginationRequest request);
}

public interface IItemUnitOfWork : IUnitOfWork
{
    IItemRepository Items { get; }
    IBatchRepository Batches { get; }
}