using System.Collections.Generic;

namespace Shared.Models;

public class ApiResponse<T>
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
    public T? Data { get; set; }
    public object? Errors { get; set; }

    public ApiResponse() { }

    public ApiResponse(T data, string message = "")
    {
        Success = true;
        Data = data;
        Message = message;
    }

    public ApiResponse(string message, object? errors = null)
    {
        Success = false;
        Message = message;
        Errors = errors;
    }
}

public class PaginationRequest
{
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public string? Sort { get; set; }
    public string? Search { get; set; }
}