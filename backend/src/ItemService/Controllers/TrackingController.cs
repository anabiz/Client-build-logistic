using Microsoft.AspNetCore.Mvc;
using ItemService.Application.Interfaces;
using Shared.Models;
using System;
using System.Threading.Tasks;

namespace ItemService.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TrackingController : ControllerBase
{
    private readonly IItemAppService _itemAppService;

    public TrackingController(IItemAppService itemAppService)
    {
        _itemAppService = itemAppService;
    }

    [HttpGet("item/{itemNumber}")]
    public async Task<IActionResult> TrackByItemNumber(string itemNumber)
    {
        // This would need to be implemented in the service layer
        // For now, return a mock response
        var mockItem = new Item
        {
            Id = "ITM001",
            ItemNumber = itemNumber,
            ApplicantName = "John Doe",
            Status = ItemStatus.InTransit,
            CreatedAt = DateTime.UtcNow.AddDays(-2),
            DispatchedAt = DateTime.UtcNow.AddDays(-1),
            EstimatedDelivery = DateTime.UtcNow.AddDays(1)
        };

        return Ok(new ApiResponse<Item>
        {
            Success = true,
            Data = mockItem
        });
    }

    [HttpGet("qr/{qrCode}")]
    public async Task<IActionResult> TrackByQrCode(string qrCode)
    {
        // This would need to be implemented in the service layer
        var mockItem = new Item
        {
            Id = "ITM001",
            QrCode = qrCode,
            ApplicantName = "John Doe",
            Status = ItemStatus.InTransit,
            CreatedAt = DateTime.UtcNow.AddDays(-2),
            DispatchedAt = DateTime.UtcNow.AddDays(-1),
            EstimatedDelivery = DateTime.UtcNow.AddDays(1)
        };

        return Ok(new ApiResponse<Item>
        {
            Success = true,
            Data = mockItem
        });
    }
}