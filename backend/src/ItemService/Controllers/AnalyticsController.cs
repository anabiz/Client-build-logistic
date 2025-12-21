using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ItemService.Application.Interfaces;
using Shared.Models;
using Shared.Controllers;

namespace ItemService.Controllers;

[Route("api/[controller]")]
public class AnalyticsController : BaseController
{
    private readonly IItemAppService _itemAppService;

    public AnalyticsController(IItemAppService itemAppService)
    {
        _itemAppService = itemAppService;
    }

    [HttpGet("dashboard")]
    public async Task<IActionResult> GetDashboardStats()
    {
        var result = await _itemAppService.GetDashboardStatsAsync();
        return result.Success ? Success(result.Data) : Error(result.Message);
    }

    [HttpGet("delivery-performance")]
    public async Task<IActionResult> GetDeliveryPerformance()
    {
        var result = await _itemAppService.GetDeliveryPerformanceAsync();
        return result.Success ? Success(result.Data) : Error(result.Message);
    }

    [HttpGet("trends")]
    public async Task<IActionResult> GetDeliveryTrends()
    {
        var result = await _itemAppService.GetDeliveryTrendsAsync();
        return result.Success ? Success(result.Data) : Error(result.Message);
    }

    [HttpGet("states")]
    public async Task<IActionResult> GetStateDistribution()
    {
        var result = await _itemAppService.GetStateDistributionAsync();
        return result.Success ? Success(result.Data) : Error(result.Message);
    }
}