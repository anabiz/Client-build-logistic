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
    public async Task<IActionResult> GetDeliveries([FromQuery] DeliveryQuery query)
    {
        var result = await _deliveryAppService.GetDeliveriesAsync(query);
        return Success(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetDelivery(string id)
    {
        var result = await _deliveryAppService.GetDeliveryByIdAsync(id);
        return result != null ? Success(result) : NotFound("Delivery not found");
    }

    [HttpPost("assign")]
    [ProducesResponseType(typeof(ApiResponse<Delivery>), 200)]
    public async Task<IActionResult> AssignDelivery([FromBody] AssignDeliveryRequest request)
    {
        var result = await _deliveryAppService.AssignDeliveryAsync(request);
        return Success(result);
    }

    [HttpPost("bulk-assign")]
    public async Task<IActionResult> BulkAssignDeliveries([FromBody] BulkAssignRequest request)
    {
        var result = await _deliveryAppService.BulkAssignDeliveriesAsync(request);
        return Success(result);
    }

    [HttpPut("{id}/pickup")]
    [ProducesResponseType(typeof(ApiResponse<Delivery>), 200)]
    public async Task<IActionResult> MarkPickedUp(string id)
    {
        var result = await _deliveryAppService.MarkPickedUpAsync(id);
        return Success(result);
    }

    [HttpPut("{id}/deliver")]
    [ProducesResponseType(typeof(ApiResponse<Delivery>), 200)]
    public async Task<IActionResult> MarkDelivered(string id, [FromBody] ProofOfDeliveryRequest request)
    {
        var result = await _deliveryAppService.MarkDeliveredAsync(id, request);
        return Success(result);
    }

    [HttpPut("{id}/fail")]
    public async Task<IActionResult> MarkFailed(string id, [FromBody] FailDeliveryRequest request)
    {
        var result = await _deliveryAppService.MarkFailedAsync(id, request.Reason, request.Notes);
        return Success(result);
    }

    [HttpGet("stats")]
    public async Task<IActionResult> GetDeliveryStats([FromQuery] DeliveryStatsQuery query)
    {
        var result = await _deliveryAppService.GetDeliveryStatsAsync(query);
        return Success(result);
    }
}