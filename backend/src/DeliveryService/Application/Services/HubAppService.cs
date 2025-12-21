using DeliveryService.Domain.Interfaces;
using DeliveryService.Application.Interfaces;
using Shared.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DeliveryService.Application.Services;

public class HubAppService : IHubAppService
{
    private readonly IDeliveryUnitOfWork _unitOfWork;

    public HubAppService(IDeliveryUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async System.Threading.Tasks.Task<IEnumerable<Hub>> GetHubsAsync()
    {
        return await _unitOfWork.Hubs.GetAllAsync();
    }

    public async System.Threading.Tasks.Task<Hub> CreateHubAsync(Hub hub)
    {
        hub.Id = Guid.NewGuid().ToString();
        await _unitOfWork.Hubs.AddAsync(hub);
        await _unitOfWork.SaveChangesAsync();
        return hub;
    }

    public async System.Threading.Tasks.Task<Hub?> GetHubByIdAsync(string id)
    {
        return await _unitOfWork.Hubs.GetByIdAsync(id);
    }
}