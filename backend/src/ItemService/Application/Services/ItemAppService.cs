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

    public async Task<ApiResponse<PagedList<Item>>> GetItemsAsync(ItemQuery query)
    {
        var items = await _unitOfWork.Items.GetAllAsync();
        var filteredItems = items.AsQueryable();

        if (!string.IsNullOrEmpty(query.Search))
        {
            filteredItems = filteredItems.Where(i => 
                i.ItemNumber.Contains(query.Search, StringComparison.OrdinalIgnoreCase) ||
                i.ApplicantName.Contains(query.Search, StringComparison.OrdinalIgnoreCase) ||
                i.QrCode.Contains(query.Search, StringComparison.OrdinalIgnoreCase));
        }

        if (!string.IsNullOrEmpty(query.Status))
        {
            filteredItems = filteredItems.Where(i => i.Status.ToString() == query.Status);
        }

        if (!string.IsNullOrEmpty(query.State))
        {
            filteredItems = filteredItems.Where(i => i.State == query.State);
        }

        var pagedItems = PagedList<Item>.Create(filteredItems, query.Page, query.PageSize);
        return new ApiResponse<PagedList<Item>>(pagedItems, "Items retrieved successfully");
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

    public async Task<ApiResponse<Item>> UpdateItemStatusAsync(string id, string status)
    {
        var item = await _unitOfWork.Items.GetByIdAsync(id);
        if (item == null)
            throw new AppException(System.Net.HttpStatusCode.NotFound, "Item not found");

        if (Enum.TryParse<ItemStatus>(status, true, out var itemStatus))
        {
            item.Status = itemStatus;
        }
        else
        {
            throw new AppException(System.Net.HttpStatusCode.BadRequest, "Invalid status");
        }
        
        if (itemStatus == ItemStatus.Dispatched)
            item.DispatchedAt = DateTime.UtcNow;
        else if (itemStatus == ItemStatus.Delivered)
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

    public async Task<ApiResponse<Item>> ReassignItemAsync(string id, string newRiderId, string reason)
    {
        var item = await _unitOfWork.Items.GetByIdAsync(id);
        if (item == null)
            throw new AppException(System.Net.HttpStatusCode.NotFound, "Item not found");

        item.RiderId = newRiderId;
        await _unitOfWork.Items.UpdateAsync(item);
        await _unitOfWork.SaveChangesAsync();

        return new ApiResponse<Item>(item, "Item reassigned successfully");
    }

    public async Task<ApiResponse<object>> GetItemStatsAsync(ItemStatsQuery query)
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

    public async Task<ApiResponse<IEnumerable<string>>> GetStatesAsync()
    {
        var states = new[] { "Lagos", "Abuja", "Rivers", "Kano", "Ogun", "Oyo", "Kaduna", "Anambra" };
        return new ApiResponse<IEnumerable<string>>(states, "States retrieved successfully");
    }

    public async Task<ApiResponse<IEnumerable<string>>> GetLgasAsync(string state)
    {
        var lgas = state.ToLower() switch
        {
            "lagos" => new[] { "Ikeja", "Eti-Osa", "Lekki", "Isolo", "Surulere", "Gbagada" },
            "abuja" => new[] { "Abuja Municipal", "Gwagwalada", "Kuje", "Bwari" },
            _ => new[] { "Central", "North", "South" }
        };
        return new ApiResponse<IEnumerable<string>>(lgas, "LGAs retrieved successfully");
    }

    public async Task<ApiResponse<Item>> TrackItemAsync(string trackingNumber, string? email, string? phone)
    {
        if (string.IsNullOrWhiteSpace(trackingNumber))
            throw new AppException(System.Net.HttpStatusCode.BadRequest, "Tracking number is required");
        
        if (string.IsNullOrWhiteSpace(email) && string.IsNullOrWhiteSpace(phone))
            throw new AppException(System.Net.HttpStatusCode.BadRequest, "Email or phone number is required for verification");

        var items = await _unitOfWork.Items.GetAllAsync();
        var item = items.FirstOrDefault(i => 
            (i.ItemNumber.Equals(trackingNumber, StringComparison.OrdinalIgnoreCase) || 
             i.QrCode.Equals(trackingNumber, StringComparison.OrdinalIgnoreCase)) &&
            ((!string.IsNullOrWhiteSpace(email) && i.ApplicantEmail.Equals(email, StringComparison.OrdinalIgnoreCase)) ||
             (!string.IsNullOrWhiteSpace(phone) && i.ApplicantPhone.Equals(phone, StringComparison.OrdinalIgnoreCase))));

        if (item == null)
            throw new AppException(System.Net.HttpStatusCode.NotFound, "Item not found or verification failed");

        return new ApiResponse<Item>(item, "Item tracked successfully");
    }
}