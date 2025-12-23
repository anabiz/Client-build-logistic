using DeliveryService.DTOs;
using Shared.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DeliveryService.Application.Interfaces;

public interface IRiderAppService
{
    Task<ApiResponse<PagedList<Rider>>> GetRidersAsync(RiderQuery query);
    Task<ApiResponse<IEnumerable<Rider>>> GetAvailableRidersAsync(string? region = null);
    Task<ApiResponse<Rider>> CreateRiderAsync(CreateRiderRequest request);
    Task<ApiResponse<Rider>> GetRiderByIdAsync(string id);
    Task<ApiResponse<Rider>> UpdateRiderAsync(string id, UpdateRiderRequest request);
    Task<ApiResponse<Rider>> UpdateRiderStatusAsync(string id, string status);
    Task<ApiResponse<object>> GetRiderPerformanceAsync(string id, PerformanceQuery query);
    Task<ApiResponse<PagedList<object>>> GetRiderDeliveriesAsync(DeliveryQuery query);
    Task<ApiResponse<PagedList<RiderPerformanceDto>>> GetRidersPerformanceAsync(RiderPerformanceQuery query);
    Task<ApiResponse<PagedList<DeliveryHistoryDto>>> GetRiderDeliveryHistoryAsync(string riderId, int pageNumber, int pageSize);
    Task<ApiResponse<PerformanceSummaryDto>> GetPerformanceSummaryAsync();
}