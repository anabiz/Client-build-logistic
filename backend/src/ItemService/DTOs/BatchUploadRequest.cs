using Microsoft.AspNetCore.Http;

namespace ItemService.DTOs;

public class BatchUploadRequest
{
    public IFormFile File { get; set; } = null!;
    public string ClientId { get; set; } = string.Empty;
    public string UploadedBy { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
}