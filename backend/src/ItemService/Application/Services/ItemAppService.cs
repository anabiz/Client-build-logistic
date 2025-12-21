using ItemService.Domain.Interfaces;
using ItemService.DTOs;
using ItemService.Application.Interfaces;
using Shared.Models;
using Shared.Services;
using Shared.Messages;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ItemService.Application.Services;

public class ItemAppService : IItemAppService
{
    private readonly IItemUnitOfWork _unitOfWork;
    private readonly IKafkaService _kafkaService;

    public ItemAppService(IItemUnitOfWork unitOfWork, IKafkaService kafkaService)
    {
        _unitOfWork = unitOfWork;
        _kafkaService = kafkaService;
    }

    public async Task<ApiResponse<PagedList<Item>>> GetItemsAsync(PaginationRequest request, string? status = null, string? state = null)
    {
        var items = await _unitOfWork.Items.GetPagedAsync(request, status, state);
        return new ApiResponse<PagedList<Item>>(items, "Items retrieved successfully");
    }

    public async Task<ApiResponse<Item>> GetItemByIdAsync(string id)
    {
        var item = await _unitOfWork.Items.GetByIdAsync(id);
        if (item == null)
            throw new AppException(System.Net.HttpStatusCode.NotFound, "Item not found");

        return new ApiResponse<Item>(item);
    }

    public async Task<ApiResponse<Item>> CreateItemAsync(Item item)
    {
        item.Id = Guid.NewGuid().ToString();
        item.CreatedAt = DateTime.UtcNow;
        item.Status = ItemStatus.Received;

        await _unitOfWork.Items.AddAsync(item);
        await _unitOfWork.SaveChangesAsync();

        await _kafkaService.PublishAsync("item-created", new ItemStatusChangedEvent
        {
            ItemId = item.Id,
            Status = item.Status.ToString(),
            Timestamp = DateTime.UtcNow
        });

        return new ApiResponse<Item>(item, "Item created successfully");
    }

    public async Task<ApiResponse<Item>> UpdateItemStatusAsync(string id, ItemStatus status)
    {
        var item = await _unitOfWork.Items.GetByIdAsync(id);
        if (item == null)
            throw new AppException(System.Net.HttpStatusCode.NotFound, "Item not found");

        item.Status = status;
        
        if (status == ItemStatus.Dispatched)
            item.DispatchedAt = DateTime.UtcNow;
        else if (status == ItemStatus.Delivered)
            item.DeliveredAt = DateTime.UtcNow;

        await _unitOfWork.Items.UpdateAsync(item);
        await _unitOfWork.SaveChangesAsync();

        await _kafkaService.PublishAsync("item-status-changed", new ItemStatusChangedEvent
        {
            ItemId = item.Id,
            Status = item.Status.ToString(),
            RiderId = item.RiderId,
            Timestamp = DateTime.UtcNow
        });

        return new ApiResponse<Item>(item, "Item status updated successfully");
    }

    public async Task<ApiResponse<object>> GetDashboardStatsAsync()
    {
        var allItems = await _unitOfWork.Items.GetAllAsync();
        var totalItems = allItems.Count();
        var delivered = allItems.Count(i => i.Status == ItemStatus.Delivered);
        var inTransit = allItems.Count(i => i.Status == ItemStatus.InTransit);
        var pending = allItems.Count(i => i.Status == ItemStatus.Received || i.Status == ItemStatus.Stored);
        var failed = allItems.Count(i => i.Status == ItemStatus.Failed);

        return new ApiResponse<object>(new
        {
            total = totalItems,
            delivered,
            inTransit,
            pending,
            failed,
            deliveryRate = totalItems > 0 ? (double)delivered / totalItems * 100 : 0
        });
    }

    public async Task<ApiResponse<object>> GetDeliveryPerformanceAsync()
    {
        var analytics = new
        {
            averageDeliveryTime = 2.5,
            onTimeDeliveryRate = 94.2,
            customerSatisfaction = 4.6,
            monthlyTrends = new[]
            {
                new { month = "Nov", delivered = 1250, failed = 45 },
                new { month = "Dec", delivered = 1380, failed = 32 }
            }
        };

        return new ApiResponse<object>(analytics);
    }

    public async Task<ApiResponse<object>> GetDeliveryTrendsAsync()
    {
        var trendData = new[]
        {
            new { date = "Dec 15", deliveries = 45, failed = 2 },
            new { date = "Dec 16", deliveries = 52, failed = 3 },
            new { date = "Dec 17", deliveries = 48, failed = 1 },
            new { date = "Dec 18", deliveries = 61, failed = 4 },
            new { date = "Dec 19", deliveries = 55, failed = 2 },
            new { date = "Dec 20", deliveries = 58, failed = 1 },
            new { date = "Dec 21", deliveries = 42, failed = 3 }
        };

        return new ApiResponse<object>(trendData);
    }

    public async Task<ApiResponse<object>> GetStateDistributionAsync()
    {
        var stateData = new[]
        {
            new { state = "Lagos", count = 450 },
            new { state = "Abuja", count = 280 },
            new { state = "Rivers", count = 180 },
            new { state = "Kano", count = 120 },
            new { state = "Ogun", count = 95 }
        };

        return new ApiResponse<object>(stateData);
    }
}