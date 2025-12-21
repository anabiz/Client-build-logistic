using ItemService.DTOs;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Shared.Models;

namespace ItemService.Application.Interfaces;

public interface IItemAppService
{
    Task<ApiResponse<PagedList<Item>>> GetItemsAsync(PaginationRequest request, string? status = null, string? state = null);
    Task<ApiResponse<Item>> GetItemByIdAsync(string id);
    Task<ApiResponse<Item>> CreateItemAsync(Item item);
    Task<ApiResponse<Item>> UpdateItemStatusAsync(string id, ItemStatus status);
    Task<ApiResponse<object>> GetDashboardStatsAsync();
    Task<ApiResponse<object>> GetDeliveryPerformanceAsync();
    Task<ApiResponse<object>> GetDeliveryTrendsAsync();
    Task<ApiResponse<object>> GetStateDistributionAsync();
}