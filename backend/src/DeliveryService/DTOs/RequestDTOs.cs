namespace DeliveryService.DTOs;

public class CreateRiderRequest
{
    public string Name { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string VehicleNumber { get; set; } = string.Empty;
    public string Region { get; set; } = string.Empty;
}

public class UpdateRiderRequest
{
    public string? Name { get; set; }
    public string? Phone { get; set; }
    public string? Email { get; set; }
    public string? VehicleNumber { get; set; }
    public string? Region { get; set; }
}

public class UpdateRiderStatusRequest
{
    public string Status { get; set; } = string.Empty;
}

public class PerformanceQuery
{
    public DateTime? From { get; set; }
    public DateTime? To { get; set; }
    public string? MetricType { get; set; }
}

public class DeliveryQuery
{
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public string? RiderId { get; set; }
    public string? Status { get; set; }
    public DateTime? From { get; set; }
    public DateTime? To { get; set; }
}