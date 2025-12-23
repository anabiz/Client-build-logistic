using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ItemService.Application.Interfaces;
using ItemService.DTOs;
using Shared.Models;
using Shared.Controllers;

namespace ItemService.Controllers;

[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/[controller]")]
public class ItemsController : BaseController
{
    private readonly IItemAppService _itemAppService;

    public ItemsController(IItemAppService itemAppService)
    {
        _itemAppService = itemAppService;
    }

    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<PagedList<Item>>), 200)]
    public async Task<IActionResult> GetItems([FromQuery] ItemQuery query)
    {
        var result = await _itemAppService.GetItemsAsync(query);
        return Success(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetItem(string id)
    {
        var result = await _itemAppService.GetItemByIdAsync(id);
        return result != null ? Success(result) : NotFound("Item not found");
    }

    [HttpPost]
    public async Task<IActionResult> CreateItem([FromBody] Item item)
    {
        var result = await _itemAppService.CreateItemAsync(item);
        return Created(result);
    }

    [HttpPut("{id}/status")]
    public async Task<IActionResult> UpdateItemStatus(string id, [FromBody] UpdateStatusRequest request)
    {
        var result = await _itemAppService.UpdateItemStatusAsync(id, request.Status);
        return result != null ? Success(result) : NotFound("Item not found");
    }

    [HttpPost("{id}/reassign")]
    public async Task<IActionResult> ReassignItem(string id, [FromBody] ReassignItemRequest request)
    {
        var result = await _itemAppService.ReassignItemAsync(id, request.NewRiderId, request.Reason);
        return result != null ? Success(result) : NotFound("Item not found");
    }

    [HttpGet("stats")]
    public async Task<IActionResult> GetItemStats([FromQuery] ItemStatsQuery query)
    {
        var result = await _itemAppService.GetItemStatsAsync(query);
        return Success(result);
    }

    [HttpGet("states")]
    public async Task<IActionResult> GetStates()
    {
        var result = await _itemAppService.GetStatesAsync();
        return Success(result);
    }

    [HttpGet("lgas/{state}")]
    public async Task<IActionResult> GetLgas(string state)
    {
        var result = await _itemAppService.GetLgasAsync(state);
        return Success(result);
    }

    [HttpPost("track")]
    public async Task<IActionResult> TrackItem([FromBody] TrackItemRequest request)
    {
        var result = await _itemAppService.TrackItemAsync(request.TrackingNumber, request.Email, request.Phone);
        return result != null ? Success(result) : NotFound("Item not found or verification failed");
    }

    [HttpPost("{id}/print-label")]
    public async Task<IActionResult> PrintLabel(string id)
    {
        var item = await _itemAppService.GetItemByIdAsync(id);
        if (item == null)
            return NotFound("Item not found");

        var labelData = new
        {
            itemNumber = item.ItemNumber,
            qrCode = item.QrCode,
            applicantName = item.ApplicantName,
            deliveryAddress = item.DeliveryAddress,
            printUrl = $"/api/v1/items/{id}/label.pdf"
        };

        return Success(labelData, "Label generated successfully");
    }
}