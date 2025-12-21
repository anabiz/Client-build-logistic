using Microsoft.AspNetCore.Mvc;
using Shared.Models;

namespace Shared.Controllers;

[ApiController]
public abstract class BaseController : ControllerBase
{
    protected IActionResult Success<T>(T data, string message = "Success")
    {
        return Ok(new ApiResponse<T>
        {
            Success = true,
            Message = message,
            Data = data
        });
    }

    protected IActionResult Success(string message = "Success")
    {
        return Ok(new ApiResponse<object>
        {
            Success = true,
            Message = message
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

    protected IActionResult NotFound(string message = "Resource not found")
    {
        return StatusCode(404, new ApiResponse<object>
        {
            Success = false,
            Message = message
        });
    }

    protected IActionResult Created<T>(T data, string message = "Created successfully")
    {
        return StatusCode(201, new ApiResponse<T>
        {
            Success = true,
            Message = message,
            Data = data
        });
    }
}