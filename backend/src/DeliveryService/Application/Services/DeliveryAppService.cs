using DeliveryService.Domain.Interfaces;
using DeliveryService.DTOs;
using DeliveryService.Application.Interfaces;
using DeliveryService.Application.Validators;
using Shared.Models;
using Shared.Services;
using Shared.Messages;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using System.Net;

namespace DeliveryService.Application.Services;

public class DeliveryAppService : IDeliveryAppService
{
    private readonly IDeliveryUnitOfWork _unitOfWork;
    private readonly IKafkaService _kafkaService;
    private readonly AssignDeliveryRequestValidator _assignDeliveryValidator;
    private readonly ProofOfDeliveryRequestValidator _proofOfDeliveryValidator;

    public DeliveryAppService(
        IDeliveryUnitOfWork unitOfWork, 
        IKafkaService kafkaService)
    {
        _unitOfWork = unitOfWork;
        _kafkaService = kafkaService;
        _assignDeliveryValidator = new AssignDeliveryRequestValidator();
        _proofOfDeliveryValidator = new ProofOfDeliveryRequestValidator();
    }

    public async Task<ApiResponse<PagedList<Delivery>>> GetDeliveriesAsync(PaginationRequest request, string? riderId = null)
    {
        var deliveries = await _unitOfWork.Deliveries.GetPagedAsync(request, riderId);
        return new ApiResponse<PagedList<Delivery>>(deliveries, "Deliveries retrieved successfully");
    }

    public async Task<ApiResponse<Delivery>> AssignDeliveryAsync(AssignDeliveryRequest request)
    {
        var validationResult = await _assignDeliveryValidator.ValidateAsync(request);
        if (!validationResult.IsValid)
            throw new AppException(HttpStatusCode.BadRequest, "Validation failed", validationResult.Errors.Select(e => new { Field = e.PropertyName, Message = e.ErrorMessage }));

        var rider = await _unitOfWork.Riders.GetByIdAsync(request.RiderId);
        if (rider == null)
            throw new AppException(HttpStatusCode.NotFound, "Rider not found");

        var delivery = new Delivery
        {
            Id = Guid.NewGuid().ToString(),
            ItemId = request.ItemId,
            RiderId = request.RiderId,
            Status = ItemStatus.Dispatched,
            AssignedAt = DateTime.UtcNow
        };

        await _unitOfWork.Deliveries.AddAsync(delivery);
        await _unitOfWork.SaveChangesAsync();

        await _kafkaService.PublishAsync("delivery-assigned", new DeliveryAssignedEvent
        {
            DeliveryId = delivery.Id,
            ItemId = delivery.ItemId,
            RiderId = delivery.RiderId,
            AssignedAt = delivery.AssignedAt
        });

        return new ApiResponse<Delivery>(delivery, "Delivery assigned successfully");
    }

    public async Task<ApiResponse<Delivery>> MarkPickedUpAsync(string id)
    {
        // Validation
        if (string.IsNullOrEmpty(id))
            throw new AppException(HttpStatusCode.BadRequest, "Delivery ID is required");

        var delivery = await _unitOfWork.Deliveries.GetByIdAsync(id);
        if (delivery == null)
            throw new AppException(HttpStatusCode.NotFound, "Delivery not found");

        if (delivery.Status != ItemStatus.Dispatched)
            throw new AppException(HttpStatusCode.BadRequest, "Delivery must be in Dispatched status to be picked up");

        delivery.Status = ItemStatus.InTransit;
        delivery.PickedUpAt = DateTime.UtcNow;
        await _unitOfWork.Deliveries.UpdateAsync(delivery);
        await _unitOfWork.SaveChangesAsync();

        return new ApiResponse<Delivery>(delivery, "Delivery marked as picked up");
    }

    public async Task<ApiResponse<Delivery>> MarkDeliveredAsync(string id, ProofOfDeliveryRequest request)
    {
        if (string.IsNullOrEmpty(id))
            throw new AppException(HttpStatusCode.BadRequest, "Delivery ID is required");

        var validationResult = await _proofOfDeliveryValidator.ValidateAsync(request);
        if (!validationResult.IsValid)
            throw new AppException(HttpStatusCode.BadRequest, "Validation failed", validationResult.Errors.Select(e => new { Field = e.PropertyName, Message = e.ErrorMessage }));

        var delivery = await _unitOfWork.Deliveries.GetByIdAsync(id);
        if (delivery == null)
            throw new AppException(HttpStatusCode.NotFound, "Delivery not found");

        if (delivery.Status != ItemStatus.InTransit)
            throw new AppException(HttpStatusCode.BadRequest, "Delivery must be in InTransit status to be delivered");

        delivery.Status = ItemStatus.Delivered;
        delivery.DeliveredAt = DateTime.UtcNow;
        delivery.ProofOfDelivery = new ProofOfDelivery
        {
            Signature = request.Signature,
            Photo = request.Photo,
            GpsLocation = request.GpsLocation,
            Timestamp = DateTime.UtcNow,
            RecipientName = request.RecipientName
        };

        await _unitOfWork.Deliveries.UpdateAsync(delivery);
        await _unitOfWork.SaveChangesAsync();
        
        return new ApiResponse<Delivery>(delivery, "Delivery marked as delivered");
    }
}