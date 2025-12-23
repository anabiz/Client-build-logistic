using DeliveryService.Domain.Interfaces;
using DeliveryService.Application.Interfaces;
using DeliveryService.DTOs;
using Shared.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Net;
using System.Linq;

namespace DeliveryService.Application.Services;

public class RiderAppService : IRiderAppService
{
    private readonly IDeliveryUnitOfWork _unitOfWork;

    public RiderAppService(IDeliveryUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<ApiResponse<PagedList<Rider>>> GetRidersAsync(RiderQuery query)
    {
        var riders = await _unitOfWork.Riders.GetAllAsync();
        var filteredRiders = riders.AsQueryable();

        if (!string.IsNullOrEmpty(query.Search))
        {
            filteredRiders = filteredRiders.Where(r => 
                r.Name.Contains(query.Search, StringComparison.OrdinalIgnoreCase) ||
                r.Phone.Contains(query.Search, StringComparison.OrdinalIgnoreCase) ||
                r.Email.Contains(query.Search, StringComparison.OrdinalIgnoreCase));
        }

        if (!string.IsNullOrEmpty(query.Status))
        {
            filteredRiders = filteredRiders.Where(r => r.Status == query.Status);
        }

        var pagedRiders = PagedList<Rider>.Create(filteredRiders, query.Page, query.PageSize);
        return new ApiResponse<PagedList<Rider>>(pagedRiders, "Riders retrieved successfully");
    }

    public async Task<ApiResponse<IEnumerable<Rider>>> GetAvailableRidersAsync(string? region = null)
    {
        var riders = await _unitOfWork.Riders.GetAvailableRidersAsync(region);
        return new ApiResponse<IEnumerable<Rider>>(riders, "Available riders retrieved successfully");
    }

    public async Task<ApiResponse<Rider>> CreateRiderAsync(CreateRiderRequest request)
    {
        var rider = new Rider
        {
            Id = Guid.NewGuid().ToString(),
            Name = request.Name,
            Phone = request.Phone,
            Email = request.Email,
            VehicleNumber = request.VehicleNumber,
            Region = request.Region,
            Status = "active",
            Rating = 0,
            TotalDeliveries = 0,
            SuccessRate = 0
        };

        await _unitOfWork.Riders.AddAsync(rider);
        await _unitOfWork.SaveChangesAsync();
        return new ApiResponse<Rider>(rider, "Rider created successfully");
    }

    public async Task<ApiResponse<Rider>> GetRiderByIdAsync(string id)
    {
        var rider = await _unitOfWork.Riders.GetByIdAsync(id);
        if (rider == null)
            throw new AppException(HttpStatusCode.NotFound, "Rider not found");

        return new ApiResponse<Rider>(rider, "Rider retrieved successfully");
    }

    public async Task<ApiResponse<Rider>> UpdateRiderAsync(string id, UpdateRiderRequest request)
    {
        var rider = await _unitOfWork.Riders.GetByIdAsync(id);
        if (rider == null)
            throw new AppException(HttpStatusCode.NotFound, "Rider not found");

        rider.Name = request.Name;
        rider.Phone = request.Phone;
        rider.Email = request.Email;
        rider.VehicleNumber = request.VehicleNumber;
        rider.Region = request.Region;

        await _unitOfWork.Riders.UpdateAsync(rider);
        await _unitOfWork.SaveChangesAsync();

        return new ApiResponse<Rider>(rider, "Rider updated successfully");
    }

    public async Task<ApiResponse<Rider>> UpdateRiderStatusAsync(string id, string status)
    {
        var rider = await _unitOfWork.Riders.GetByIdAsync(id);
        if (rider == null)
            throw new AppException(HttpStatusCode.NotFound, "Rider not found");

        rider.Status = status;
        await _unitOfWork.Riders.UpdateAsync(rider);
        await _unitOfWork.SaveChangesAsync();

        return new ApiResponse<Rider>(rider, "Rider status updated successfully");
    }

    public async Task<ApiResponse<object>> GetRiderPerformanceAsync(string id, PerformanceQuery query)
    {
        var rider = await _unitOfWork.Riders.GetByIdAsync(id);
        if (rider == null)
            throw new AppException(HttpStatusCode.NotFound, "Rider not found");

        var performance = new
        {
            RiderId = rider.Id,
            RiderName = rider.Name,
            TotalDeliveries = rider.TotalDeliveries,
            SuccessRate = rider.SuccessRate,
            Rating = rider.Rating
        };

        return new ApiResponse<object>(performance, "Rider performance retrieved successfully");
    }

    public async Task<ApiResponse<PagedList<object>>> GetRiderDeliveriesAsync(DeliveryQuery query)
    {
        var deliveries = await _unitOfWork.Deliveries.GetByRiderIdAsync(query.RiderId!);
        var pagedDeliveries = PagedList<object>.Create(deliveries.Cast<object>().AsQueryable(), query.Page, query.PageSize);
        return new ApiResponse<PagedList<object>>(pagedDeliveries, "Rider deliveries retrieved successfully");
    }

    public async Task<ApiResponse<PagedList<RiderPerformanceDto>>> GetRidersPerformanceAsync(RiderPerformanceQuery query)
    {
        var riders = await _unitOfWork.Riders.GetAllAsync();
        var performanceData = riders.Select(r => new RiderPerformanceDto
        {
            RiderId = r.Id,
            RiderName = r.Name,
            OnTimeDeliveries = (int)(r.TotalDeliveries * r.SuccessRate / 100),
            LateDeliveries = r.TotalDeliveries - (int)(r.TotalDeliveries * r.SuccessRate / 100),
            SlaCompliance = r.SuccessRate,
            AvgDeliveryTime = 2.1,
            TargetDeliveryTime = 2.5,
            Status = r.SuccessRate >= 95 ? "excellent" : r.SuccessRate >= 90 ? "good" : r.SuccessRate >= 85 ? "needs-improvement" : "critical",
            Region = r.Region
        }).AsQueryable();

        if (!string.IsNullOrEmpty(query.Search))
        {
            performanceData = performanceData.Where(p => 
                p.RiderName.Contains(query.Search, StringComparison.OrdinalIgnoreCase) ||
                p.RiderId.Contains(query.Search, StringComparison.OrdinalIgnoreCase));
        }

        if (!string.IsNullOrEmpty(query.Status))
        {
            performanceData = performanceData.Where(p => p.Status == query.Status);
        }

        var pagedData = PagedList<RiderPerformanceDto>.Create(performanceData, query.Page, query.PageSize);
        return new ApiResponse<PagedList<RiderPerformanceDto>>(pagedData, "Rider performance data retrieved successfully");
    }

    public async Task<ApiResponse<PagedList<DeliveryHistoryDto>>> GetRiderDeliveryHistoryAsync(string riderId, int pageNumber, int pageSize)
    {
        var deliveries = await _unitOfWork.Deliveries.GetByRiderIdAsync(riderId);
        var historyData = deliveries.Select(d => new DeliveryHistoryDto
        {
            DeliveryId = d.Id,
            ItemId = d.ItemId,
            AssignedDate = d.AssignedDate,
            DeliveredDate = d.DeliveredDate,
            Status = d.Status,
            DeliveryTimeInDays = d.DeliveredDate.HasValue ? (d.DeliveredDate.Value - d.AssignedDate).TotalDays : 0,
            IsOnTime = d.DeliveredDate.HasValue && (d.DeliveredDate.Value - d.AssignedDate).TotalDays <= 2.5
        }).AsQueryable();

        var pagedHistory = PagedList<DeliveryHistoryDto>.Create(historyData, pageNumber, pageSize);
        return new ApiResponse<PagedList<DeliveryHistoryDto>>(pagedHistory, "Rider delivery history retrieved successfully");
    }

    public async Task<ApiResponse<PerformanceSummaryDto>> GetPerformanceSummaryAsync()
    {
        var riders = await _unitOfWork.Riders.GetAllAsync();
        var totalOnTime = riders.Sum(r => (int)(r.TotalDeliveries * r.SuccessRate / 100));
        var totalLate = riders.Sum(r => r.TotalDeliveries) - totalOnTime;
        
        var summary = new PerformanceSummaryDto
        {
            AverageSlaCompliance = riders.Any() ? riders.Average(r => r.SuccessRate) : 0,
            TotalOnTimeDeliveries = totalOnTime,
            TotalLateDeliveries = totalLate,
            TopPerformersCount = riders.Count(r => r.SuccessRate >= 95),
            LateDeliveryPercentage = totalOnTime + totalLate > 0 ? (double)totalLate / (totalOnTime + totalLate) * 100 : 0
        };

        return new ApiResponse<PerformanceSummaryDto>(summary, "Performance summary retrieved successfully");
    }
}