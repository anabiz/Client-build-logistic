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

public class RiderRepository : Repository<Rider>, IRiderRepository
{
    public RiderRepository(DeliveryDbContext context) : base(context) { }

    public async Task<IEnumerable<Rider>> GetAvailableRidersAsync(string? region = null)
    {
        var query = _context.Set<Rider>().Where(r => r.Status == "Available");
        
        if (!string.IsNullOrEmpty(region))
            query = query.Where(r => r.Region == region);

        return await query.ToListAsync();
    }

    public async Task<IEnumerable<Rider>> GetByRegionAsync(string region)
    {
        return await _context.Set<Rider>()
            .Where(r => r.Region == region)
            .ToListAsync();
    }
}