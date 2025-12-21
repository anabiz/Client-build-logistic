using Microsoft.EntityFrameworkCore;
using DeliveryService.Data;
using DeliveryService.Domain.Interfaces;
using Shared.Models;
using Shared.Infrastructure.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DeliveryService.Infrastructure.Repositories;

public class DeliveryRepository : Repository<Delivery>, IDeliveryRepository
{
    public DeliveryRepository(DeliveryDbContext context) : base(context) { }

    public async Task<IEnumerable<Delivery>> GetByRiderIdAsync(string riderId)
    {
        return await _context.Set<Delivery>()
            .Where(d => d.RiderId == riderId)
            .ToListAsync();
    }

    public async Task<PagedList<Delivery>> GetPagedAsync(PaginationRequest request, string? riderId = null)
    {
        var query = _context.Set<Delivery>().AsQueryable();

        if (!string.IsNullOrEmpty(riderId))
            query = query.Where(d => d.RiderId == riderId);

        if (!string.IsNullOrEmpty(request.Search))
            query = query.Where(d => d.ItemId.Contains(request.Search) || d.RiderId.Contains(request.Search));

        return await PagedList<Delivery>.Create(query, request.Page, request.PageSize, request.Sort);
    }
}