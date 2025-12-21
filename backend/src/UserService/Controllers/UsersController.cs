using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using UserService.Application.Services;
using UserService.Application.Interfaces;
using Shared.Models;

namespace UserService.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly IUserAppService _userAppService;

    public UsersController(IUserAppService userAppService)
    {
        _userAppService = userAppService;
    }

    [HttpGet]
    public async Task<IActionResult> GetUsers([FromQuery] PaginationRequest request)
    {
        var users = await _userAppService.GetAllUsersAsync(request);
        return Ok(users);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetUser(string id)
    {
        var result = await _userAppService.GetUserByIdAsync(id);
        if (!result.Success)
            return NotFound(result);
        
        return Ok(result);
    }

    [HttpGet("me")]
    public async Task<IActionResult> GetCurrentUser()
    {
        // In real implementation, get user ID from JWT token
        var userId = "current-user-id"; // Extract from JWT claims
        var result = await _userAppService.GetUserByIdAsync(userId);
        
        if (!result.Success)
            return NotFound(result);
        
        return Ok(result);
    }
}