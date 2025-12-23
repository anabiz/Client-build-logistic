using Microsoft.AspNetCore.Mvc;
using UserService.Application.Interfaces;
using Shared.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace UserService.Controllers;

[ApiController]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/[controller]")]
public class AuditController : ControllerBase
{
    private readonly IUserAppService _userAppService;

    public AuditController(IUserAppService userAppService)
    {
        _userAppService = userAppService;
    }

    [HttpGet("logs")]
    public async Task<IActionResult> GetAuditLogs([FromQuery] AuditLogQuery query)
    {
        var result = await _userAppService.GetAuditLogsAsync(query);
        return Ok(result);
    }

    [HttpGet("actions")]
    public async Task<IActionResult> GetAuditActions()
    {
        var actions = new[] { "ITEM_ASSIGNED", "ITEM_PICKED_UP", "ITEM_DELIVERED", "BATCH_UPLOADED", "HUB_TRANSFER", "USER_LOGIN", "STATUS_CHANGED" };
        var response = new ApiResponse<string[]> { Success = true, Data = actions };
        return Ok(response);
    }
}