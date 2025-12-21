using Microsoft.AspNetCore.Mvc;
using UserService.Application.Interfaces;
using Shared.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace UserService.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuditController : ControllerBase
{
    private readonly IUserAppService _userAppService;

    public AuditController(IUserAppService userAppService)
    {
        _userAppService = userAppService;
    }

    [HttpGet("logs")]
    public async Task<IActionResult> GetAuditLogs([FromQuery] PaginationRequest request)
    {
        // Mock implementation - in real scenario, this would be from a dedicated audit service
        var mockLogs = new List<AuditLog>
        {
            new AuditLog
            {
                Id = "AL001",
                Timestamp = DateTime.UtcNow.AddHours(-2),
                UserId = "3",
                UserName = "Operations Manager",
                Action = "ITEM_ASSIGNED",
                ItemId = "ITM003",
                Details = "Item assigned to rider",
                IpAddress = "105.112.45.23"
            }
        };

        var response = new ApiResponse<PagedList<AuditLog>>
        {
            Success = true,
            Data = new PagedList<AuditLog>(mockLogs, mockLogs.Count, request.Page, request.PageSize)
        };

        return Ok(response);
    }
}