using DeliveryService.DTOs;
using Shared.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DeliveryService.Application.Interfaces;

public interface IDeliveryAppService
{
    Task<ApiResponse<PagedList<Delivery>>> GetDeliveriesAsync(PaginationRequest request, string? riderId = null);
    Task<ApiResponse<Delivery>> AssignDeliveryAsync(AssignDeliveryRequest request);
    Task<ApiResponse<Delivery>> MarkPickedUpAsync(string id);
    Task<ApiResponse<Delivery>> MarkDeliveredAsync(string id, ProofOfDeliveryRequest request);
}