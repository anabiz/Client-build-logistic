using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using UserService.Application.Interfaces;
using UserService.DTOs;
using Shared.Models;

namespace UserService.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IUserAppService _userAppService;

    public AuthController(IUserAppService userAppService)
    {
        _userAppService = userAppService;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var result = await _userAppService.LoginAsync(request.Email, request.Password);
        if (!result.Success)
            return Unauthorized(result);

        return Ok(new ApiResponse<object>
        {
            Success = true,
            Message = result.Message,
            Data = new { token = result.Data!.token, user = new { result.Data.user.Id, result.Data.user.Name, result.Data.user.Email, result.Data.user.Role } }
        });
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        var result = await _userAppService.RegisterAsync(request.Name, request.Email, request.Password, request.Role);
        if (!result.Success)
            return BadRequest(result);

        return Ok(new ApiResponse<object>
        {
            Success = true,
            Message = result.Message,
            Data = new { token = result.Data!.token, user = new { result.Data.user.Id, result.Data.user.Name, result.Data.user.Email, result.Data.user.Role } }
        });
    }

    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        // In real implementation, invalidate JWT token or add to blacklist
        return Ok(new ApiResponse<object>
        {
            Success = true,
            Message = "Logged out successfully"
        });
    }
}