using Shared.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DeliveryService.Application.Interfaces;

public interface IHubAppService
{
    System.Threading.Tasks.Task<IEnumerable<Hub>> GetHubsAsync();
    System.Threading.Tasks.Task<Hub> CreateHubAsync(Hub hub);
    System.Threading.Tasks.Task<Hub?> GetHubByIdAsync(string id);
}