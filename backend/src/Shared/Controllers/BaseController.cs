using Microsoft.AspNetCore.Mvc;
using Shared.Models;

namespace Shared.Controllers;

[ApiController]
public abstract class BaseController : ControllerBase
{
    protected IActionResult Success<T>(T data, string? message = null)
    {
        return Ok(new ApiResponse<T>
        {
            Success = true,
            Data = data,
            Message = message
        });
    }

    protected IActionResult Created<T>(T data, string? message = null)
    {
        return StatusCode(201, new ApiResponse<T>
        {
            Success = true,
            Data = data,
            Message = message ?? "Resource created successfully"
        });
    }

    protected IActionResult Error(string message, int statusCode = 400)
    {
        return StatusCode(statusCode, new ApiResponse<object>
        {
            Success = false,
            Message = message
        });
    }
}