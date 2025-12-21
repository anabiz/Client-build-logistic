using Microsoft.EntityFrameworkCore;
using Shared.Infrastructure.Repositories;
using Shared.Models;
using ItemService.Data;
using ItemService.Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ItemService.Infrastructure.Repositories;

public class ItemRepository : Repository<Item>, IItemRepository
{
    public ItemRepository(ItemDbContext context) : base(context) { }

    public async Task<IEnumerable<Item>> GetByStatusAsync(ItemStatus status)
    {
        return await _dbSet.Where(i => i.Status == status).ToListAsync();
    }

    public async Task<IEnumerable<Item>> GetByStateAsync(string state)
    {
        return await _dbSet.Where(i => i.State == state).ToListAsync();
    }

    public async Task<PagedList<Item>> GetPagedAsync(PaginationRequest request, string? status = null, string? state = null)
    {
        var query = _dbSet.AsQueryable();
        
        if (!string.IsNullOrEmpty(status) && Enum.TryParse<ItemStatus>(status, true, out var itemStatus))
            query = query.Where(i => i.Status == itemStatus);
            
        if (!string.IsNullOrEmpty(state))
            query = query.Where(i => i.State == state);
        
        if (!string.IsNullOrEmpty(request.Search))
        {
            query = query.Where(i => i.ItemNumber.Contains(request.Search) ||
                                   i.ApplicantName.Contains(request.Search) ||
                                   i.ApplicantPhone.Contains(request.Search) ||
                                   i.ApplicantEmail.Contains(request.Search) ||
                                   i.DeliveryAddress.Contains(request.Search) ||
                                   i.State.Contains(request.Search) ||
                                   i.Lga.Contains(request.Search));
        }
        
        return await PagedList<Item>.Create(query, request.Page, request.PageSize, request.Sort);
    }

    public async Task<PagedList<Item>> GetPagedByBatchIdAsync(string batchId, PaginationRequest request)
    {
        var query = _dbSet.Where(i => i.BatchId == batchId);
        
        if (!string.IsNullOrEmpty(request.Search))
        {
            query = query.Where(i => i.ItemNumber.Contains(request.Search) ||
                                   i.ApplicantName.Contains(request.Search) ||
                                   i.ApplicantPhone.Contains(request.Search) ||
                                   i.ApplicantEmail.Contains(request.Search) ||
                                   i.DeliveryAddress.Contains(request.Search));
        }
        
        return await PagedList<Item>.Create(query, request.Page, request.PageSize, request.Sort);
    }
}

public class BatchRepository : Repository<Batch>, IBatchRepository
{
    public BatchRepository(ItemDbContext context) : base(context) { }

    public async Task<IEnumerable<Batch>> GetByClientIdAsync(string clientId)
    {
        return await _dbSet.Where(b => b.ClientId == clientId).ToListAsync();
    }

    public async Task<PagedList<Batch>> GetPagedAsync(PaginationRequest request)
    {
        var query = _dbSet.AsQueryable();
        
        if (!string.IsNullOrEmpty(request.Search))
        {
            query = query.Where(b => b.BatchNumber.Contains(request.Search) || 
                                   b.Description.Contains(request.Search) ||
                                   b.UploadedBy.Contains(request.Search));
        }
        
        return await PagedList<Batch>.Create(query, request.Page, request.PageSize, request.Sort);
    }
}

public class ItemUnitOfWork : UnitOfWork, IItemUnitOfWork
{
    private readonly ItemDbContext _context;
    private IItemRepository? _items;
    private IBatchRepository? _batches;

    public ItemUnitOfWork(ItemDbContext context) : base(context)
    {
        _context = context;
    }

    public IItemRepository Items => _items ??= new ItemRepository(_context);
    public IBatchRepository Batches => _batches ??= new BatchRepository(_context);
}