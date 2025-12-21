using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using DeliveryService.Application.Interfaces;
using DeliveryService.DTOs;
using Shared.Models;
using Shared.Controllers;

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
    [ProducesResponseType(typeof(ApiResponse<IEnumerable<Rider>>), 200)]
    public async Task<IActionResult> GetRiders([FromQuery] string? region)
    {
        var result = await _riderAppService.GetRidersAsync(region);
        return Ok(result);
    }

    [HttpGet("available")]
    [ProducesResponseType(typeof(ApiResponse<IEnumerable<Rider>>), 200)]
    public async Task<IActionResult> GetAvailableRiders([FromQuery] string? region)
    {
        var result = await _riderAppService.GetAvailableRidersAsync(region);
        return Ok(result);
    }

    [HttpPost]
    [ProducesResponseType(typeof(ApiResponse<Rider>), 201)]
    public async Task<IActionResult> CreateRider([FromBody] Rider rider)
    {
        var result = await _riderAppService.CreateRiderAsync(rider);
        return Created($"api/riders/{rider.Id}", result);
    }

    [HttpGet("{id}")]
    [ProducesResponseType(typeof(ApiResponse<Rider>), 200)]
    [ProducesResponseType(404)]
    public async Task<IActionResult> GetRider(string id)
    {
        var result = await _riderAppService.GetRiderByIdAsync(id);
        return Ok(result);
    }

    [HttpPut("{id}/status")]
    [ProducesResponseType(typeof(ApiResponse<Rider>), 200)]
    [ProducesResponseType(404)]
    public async Task<IActionResult> UpdateRiderStatus(string id, [FromBody] UpdateRiderStatusRequest request)
    {
        var result = await _riderAppService.UpdateRiderStatusAsync(id, request);
        return Ok(result);
    }
}