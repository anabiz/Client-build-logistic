using DeliveryService.DTOs;
using Shared.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DeliveryService.Application.Interfaces;

public interface IRiderAppService
{
    Task<ApiResponse<IEnumerable<Rider>>> GetRidersAsync(string? region = null);
    Task<ApiResponse<IEnumerable<Rider>>> GetAvailableRidersAsync(string? region = null);
    Task<ApiResponse<Rider>> CreateRiderAsync(Rider rider);
    Task<ApiResponse<Rider>> GetRiderByIdAsync(string id);
    Task<ApiResponse<Rider>> UpdateRiderStatusAsync(string id, UpdateRiderStatusRequest request);
}