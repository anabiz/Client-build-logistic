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

public class HubRepository : Repository<Hub>, IHubRepository
{
    public HubRepository(DeliveryDbContext context) : base(context) { }

    public async Task<Hub?> GetByStateAsync(string state)
    {
        return await _context.Set<Hub>()
            .FirstOrDefaultAsync(h => h.State == state);
    }
}