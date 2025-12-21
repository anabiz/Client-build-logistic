using DeliveryService.Domain.Interfaces;
using DeliveryService.Application.Interfaces;
using DeliveryService.DTOs;
using Shared.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Net;

namespace DeliveryService.Application.Services;

public class RiderAppService : IRiderAppService
{
    private readonly IDeliveryUnitOfWork _unitOfWork;

    public RiderAppService(IDeliveryUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<ApiResponse<IEnumerable<Rider>>> GetRidersAsync(string? region = null)
    {
        var riders = !string.IsNullOrEmpty(region)
            ? await _unitOfWork.Riders.GetByRegionAsync(region)
            : await _unitOfWork.Riders.GetAllAsync();

        return new ApiResponse<IEnumerable<Rider>>(riders, "Riders retrieved successfully");
    }

    public async Task<ApiResponse<IEnumerable<Rider>>> GetAvailableRidersAsync(string? region = null)
    {
        var riders = await _unitOfWork.Riders.GetAvailableRidersAsync(region);
        return new ApiResponse<IEnumerable<Rider>>(riders, "Available riders retrieved successfully");
    }

    public async Task<ApiResponse<Rider>> CreateRiderAsync(Rider rider)
    {
        rider.Id = Guid.NewGuid().ToString();
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

    public async Task<ApiResponse<Rider>> UpdateRiderStatusAsync(string id, UpdateRiderStatusRequest request)
    {
        var rider = await _unitOfWork.Riders.GetByIdAsync(id);
        if (rider == null)
            throw new AppException(HttpStatusCode.NotFound, "Rider not found");

        rider.Status = request.Status;
        await _unitOfWork.Riders.UpdateAsync(rider);
        await _unitOfWork.SaveChangesAsync();

        return new ApiResponse<Rider>(rider, "Rider status updated successfully");
    }
}