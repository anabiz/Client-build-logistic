namespace DeliveryService.DTOs;

public class DeliveryQuery : PaginationQuery
{
    public string? RiderId { get; set; }
    public string? Status { get; set; }
    public string? State { get; set; }
    public DateTime? AssignedFrom { get; set; }
    public DateTime? AssignedTo { get; set; }
    public DateTime? DeliveredFrom { get; set; }
    public DateTime? DeliveredTo { get; set; }
}

public class RiderPerformanceQuery : PaginationQuery
{
    public string? Status { get; set; }
    public double? MinCompliance { get; set; }
    public double? MaxCompliance { get; set; }
    public string? Region { get; set; }
}

public class BulkAssignRequest
{
    public List<string> ItemIds { get; set; } = new();
    public string RiderId { get; set; } = string.Empty;
    public string HubId { get; set; } = string.Empty;
}

public class FailDeliveryRequest
{
    public string Reason { get; set; } = string.Empty;
    public string? Notes { get; set; }
}

public class DeliveryStatsQuery
{
    public DateTime? From { get; set; }
    public DateTime? To { get; set; }
    public string? RiderId { get; set; }
    public string? State { get; set; }
}

public class PaginationQuery
{
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public string? Search { get; set; }
    public string? SortBy { get; set; }
    public string? SortOrder { get; set; } = "asc";
}