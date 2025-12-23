namespace ItemService.DTOs;

public class ReassignItemRequest
{
    public string NewRiderId { get; set; } = string.Empty;
    public string Reason { get; set; } = string.Empty;
    public string? Notes { get; set; }
}

public class UpdateStatusRequest
{
    public string Status { get; set; } = string.Empty;
    public string? Notes { get; set; }
}

public class UploadBatchRequest
{
    public IFormFile File { get; set; } = null!;
    public string Description { get; set; } = string.Empty;
    public string ClientId { get; set; } = string.Empty;
}

public class TrackItemRequest
{
    public string TrackingNumber { get; set; } = string.Empty;
    public string? Email { get; set; }
    public string? Phone { get; set; }
}