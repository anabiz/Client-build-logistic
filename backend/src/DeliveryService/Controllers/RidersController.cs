using Microsoft.AspNetCore.Mvc;
using DeliveryService.Application.Interfaces;
using DeliveryService.DTOs;
using Shared.Controllers;
using Shared.Models;

namespace DeliveryService.Controllers;

[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/[controller]")]
public class RidersController : BaseController
{
    private readonly IRiderAppService _riderAppService;

    public RidersController(IRiderAppService riderAppService)
    {
        _riderAppService = riderAppService;
    }

    [HttpGet]
    public async Task<IActionResult> GetRiders([FromQuery] RiderQuery query)
    {
        var result = await _riderAppService.GetRidersAsync(query);
        return Success(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetRider(string id)
    {
        var result = await _riderAppService.GetRiderByIdAsync(id);
        return result != null ? Success(result) : NotFound("Rider not found");
    }

    [HttpPost]
    public async Task<IActionResult> CreateRider([FromBody] CreateRiderRequest request)
    {
        var result = await _riderAppService.CreateRiderAsync(request);
        return Created(result);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateRider(string id, [FromBody] UpdateRiderRequest request)
    {
        var result = await _riderAppService.UpdateRiderAsync(id, request);
        return result != null ? Success(result) : NotFound("Rider not found");
    }

    [HttpGet("{id}/performance")]
    public async Task<IActionResult> GetRiderPerformance(string id, [FromQuery] PerformanceQuery query)
    {
        var result = await _riderAppService.GetRiderPerformanceAsync(id, query);
        return Success(result);
    }

    [HttpGet("{id}/deliveries")]
    public async Task<IActionResult> GetRiderDeliveries(string id, [FromQuery] DeliveryQuery query)
    {
        query.RiderId = id;
        var result = await _riderAppService.GetRiderDeliveriesAsync(query);
        return Success(result);
    }

    [HttpPut("{id}/status")]
    public async Task<IActionResult> UpdateRiderStatus(string id, [FromBody] UpdateRiderStatusRequest request)
    {
        var result = await _riderAppService.UpdateRiderStatusAsync(id, request.Status);
        return result != null ? Success(result) : NotFound("Rider not found");
    }

    [HttpGet("available")]
    public async Task<IActionResult> GetAvailableRiders([FromQuery] string? region)
    {
        var result = await _riderAppService.GetAvailableRidersAsync(region);
        return Success(result);
    }

    [HttpGet("performance")]
    public async Task<IActionResult> GetRidersPerformance([FromQuery] RiderPerformanceQuery query)
    {
        var result = await _riderAppService.GetRidersPerformanceAsync(query);
        return Success(result);
    }

    [HttpGet("{id}/history")]
    public async Task<IActionResult> GetRiderDeliveryHistory(string id, [FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
    {
        var result = await _riderAppService.GetRiderDeliveryHistoryAsync(id, pageNumber, pageSize);
        return Success(result);
    }

    [HttpGet("performance/summary")]
    public async Task<IActionResult> GetPerformanceSummary()
    {
        var result = await _riderAppService.GetPerformanceSummaryAsync();
        return Success(result);
    }
}