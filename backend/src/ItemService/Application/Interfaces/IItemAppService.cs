using ItemService.DTOs;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Shared.Models;

namespace ItemService.Application.Interfaces;

public interface IItemAppService
{
    Task<ApiResponse<PagedList<Item>>> GetItemsAsync(ItemQuery query);
    Task<ApiResponse<Item>> GetItemByIdAsync(string id);
    Task<ApiResponse<Item>> CreateItemAsync(Item item);
    Task<ApiResponse<Item>> UpdateItemStatusAsync(string id, string status);
    Task<ApiResponse<Item>> ReassignItemAsync(string id, string newRiderId, string reason);
    Task<ApiResponse<object>> GetItemStatsAsync(ItemStatsQuery query);
    Task<ApiResponse<IEnumerable<string>>> GetStatesAsync();
    Task<ApiResponse<IEnumerable<string>>> GetLgasAsync(string state);
    Task<ApiResponse<Item>> TrackItemAsync(string trackingNumber, string? email, string? phone);
}