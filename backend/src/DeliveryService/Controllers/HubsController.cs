using Microsoft.AspNetCore.Mvc;
using DeliveryService.Application.Interfaces;
using Shared.Models;
using Shared.Controllers;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DeliveryService.Controllers;

[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/[controller]")]
public class HubsController : BaseController
{
    private readonly IHubAppService _hubAppService;

    public HubsController(IHubAppService hubAppService)
    {
        _hubAppService = hubAppService;
    }

    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<IEnumerable<Hub>>), 200)]
    public async Task<IActionResult> GetHubs()
    {
        var result = await _hubAppService.GetHubsAsync();
        return Ok(result);
    }

    [HttpPost]
    [ProducesResponseType(typeof(ApiResponse<Hub>), 201)]
    public async Task<IActionResult> CreateHub([FromBody] Hub hub)
    {
        var result = await _hubAppService.CreateHubAsync(hub);
        return Created($"api/hubs/{hub.Id}", result);
    }

    [HttpGet("{id}")]
    [ProducesResponseType(typeof(ApiResponse<Hub>), 200)]
    [ProducesResponseType(404)]
    public async Task<IActionResult> GetHub(string id)
    {
        var result = await _hubAppService.GetHubByIdAsync(id);
        return Ok(result);
    }
}