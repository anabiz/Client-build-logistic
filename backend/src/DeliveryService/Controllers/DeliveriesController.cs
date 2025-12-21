using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using DeliveryService.Application.Interfaces;
using DeliveryService.DTOs;
using Shared.Controllers;
using Shared.Models;

namespace DeliveryService.Controllers;

[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/[controller]")]
public class DeliveriesController : BaseController
{
    private readonly IDeliveryAppService _deliveryAppService;

    public DeliveriesController(IDeliveryAppService deliveryAppService)
    {
        _deliveryAppService = deliveryAppService;
    }

    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<PagedList<Delivery>>), 200)]
    public async Task<IActionResult> GetDeliveries([FromQuery] PaginationRequest request, [FromQuery] string? riderId)
    {
        var result = await _deliveryAppService.GetDeliveriesAsync(request, riderId);
        return Ok(result);
    }

    [HttpPost("assign")]
    [ProducesResponseType(typeof(ApiResponse<Delivery>), 200)]
    public async Task<IActionResult> AssignDelivery([FromBody] AssignDeliveryRequest request)
    {
        var result = await _deliveryAppService.AssignDeliveryAsync(request);
        return Ok(result);
    }

    [HttpPut("{id}/pickup")]
    [ProducesResponseType(typeof(ApiResponse<Delivery>), 200)]
    public async Task<IActionResult> MarkPickedUp(string id)
    {
        var result = await _deliveryAppService.MarkPickedUpAsync(id);
        return Ok(result);
    }

    [HttpPut("{id}/deliver")]
    [ProducesResponseType(typeof(ApiResponse<Delivery>), 200)]
    public async Task<IActionResult> MarkDelivered(string id, [FromBody] ProofOfDeliveryRequest request)
    {
        var result = await _deliveryAppService.MarkDeliveredAsync(id, request);
        return Ok(result);
    }
}