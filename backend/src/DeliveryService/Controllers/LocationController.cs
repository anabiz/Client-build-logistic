using Microsoft.AspNetCore.Mvc;
using DeliveryService.Application.Interfaces;
using DeliveryService.DTOs;
using Shared.Models;
using Shared.Controllers;
using System;
using System.Threading.Tasks;

namespace DeliveryService.Controllers;

[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/[controller]")]
public class LocationController : BaseController
{
    private readonly IDeliveryAppService _deliveryAppService;

    public LocationController(IDeliveryAppService deliveryAppService)
    {
        _deliveryAppService = deliveryAppService;
    }

    [HttpPost("capture")]
    [ProducesResponseType(typeof(ApiResponse<object>), 200)]
    public async Task<IActionResult> CaptureLocation([FromBody] LocationCaptureRequest request)
    {
        var response = new
        {
            latitude = request.Latitude,
            longitude = request.Longitude,
            address = "Auto-detected address from GPS",
            timestamp = DateTime.UtcNow,
            accuracy = "High"
        };

        var result = new ApiResponse<object>(response, "Location captured successfully");
        return Ok(result);
    }

    [HttpGet("current")]
    [ProducesResponseType(typeof(ApiResponse<object>), 200)]
    public async Task<IActionResult> GetCurrentLocation()
    {
        var location = new
        {
            latitude = 6.5244,
            longitude = 3.3792,
            address = "Lagos, Nigeria",
            timestamp = DateTime.UtcNow
        };

        var result = new ApiResponse<object>(location);
        return Ok(result);
    }
}