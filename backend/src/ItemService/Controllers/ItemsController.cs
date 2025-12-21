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
    public async Task<IActionResult> GetItems([FromQuery] PaginationRequest request, [FromQuery] string? status, [FromQuery] string? state)
    {
        var result = await _itemAppService.GetItemsAsync(request, status, state);
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetItem(string id)
    {
        var result = await _itemAppService.GetItemByIdAsync(id);
        if (!result.Success)
            return NotFound(result);
        
        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> CreateItem([FromBody] Item item)
    {
        var result = await _itemAppService.CreateItemAsync(item);
        return CreatedAtAction(nameof(GetItem), new { id = result.Data!.Id }, result);
    }

    [HttpPut("{id}/status")]
    public async Task<IActionResult> UpdateItemStatus(string id, [FromBody] UpdateStatusRequest request)
    {
        var result = await _itemAppService.UpdateItemStatusAsync(id, request.Status);
        if (!result.Success)
            return NotFound(result);
        
        return Ok(result);
    }

    [HttpPost("{id}/print-label")]
    public async Task<IActionResult> PrintLabel(string id)
    {
        var item = await _itemAppService.GetItemByIdAsync(id);
        if (!item.Success)
            return NotFound(item);

        // Generate printable QR label data
        var labelData = new
        {
            itemNumber = item.Data!.ItemNumber,
            qrCode = item.Data.QrCode,
            applicantName = item.Data.ApplicantName,
            deliveryAddress = item.Data.DeliveryAddress,
            printUrl = $"/api/items/{id}/label.pdf"
        };

        return Ok(new ApiResponse<object>
        {
            Success = true,
            Data = labelData,
            Message = "Label generated successfully"
        });
    }

    [HttpGet("search")]
    public async Task<IActionResult> SearchItems([FromQuery] string q, [FromQuery] PaginationRequest request)
    {
        // Global search across items
        var items = await _itemAppService.GetItemsAsync(request, null, null);
        
        // Filter by search query (mock implementation)
        // In real implementation, use full-text search or database search
        
        return Ok(items);
    }
}