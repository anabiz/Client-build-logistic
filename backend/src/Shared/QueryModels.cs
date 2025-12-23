using System.ComponentModel.DataAnnotations;

namespace Shared.Models;

public class PaginationQuery
{
    [Range(1, int.MaxValue)]
    public int Page { get; set; } = 1;
    
    [Range(1, 100)]
    public int PageSize { get; set; } = 10;
    
    public string? Search { get; set; }
    public string? SortBy { get; set; }
    public string? SortOrder { get; set; } = "asc";
}

public class ItemQuery : PaginationQuery
{
    public string? Status { get; set; }
    public string? State { get; set; }
    public string? Lga { get; set; }
    public string? BatchId { get; set; }
    public string? RiderId { get; set; }
    public string? HubId { get; set; }
    public DateTime? CreatedFrom { get; set; }
    public DateTime? CreatedTo { get; set; }
    public DateTime? DeliveredFrom { get; set; }
    public DateTime? DeliveredTo { get; set; }
}

public class BatchQuery : PaginationQuery
{
    public string? Status { get; set; }
    public string? ClientId { get; set; }
    public DateTime? UploadedFrom { get; set; }
    public DateTime? UploadedTo { get; set; }
}

public class RiderQuery : PaginationQuery
{
    public string? Status { get; set; }
    public string? Region { get; set; }
    public double? MinRating { get; set; }
    public double? MaxRating { get; set; }
}

public class RiderPerformanceQuery : PaginationQuery
{
    public string? Status { get; set; }
    public double? MinCompliance { get; set; }
    public double? MaxCompliance { get; set; }
    public string? Region { get; set; }
}

public class AuditLogQuery : PaginationQuery
{
    public string? UserId { get; set; }
    public string? Action { get; set; }
    public string? ItemId { get; set; }
    public DateTime? From { get; set; }
    public DateTime? To { get; set; }
}

public class ItemStatsQuery
{
    public DateTime? From { get; set; }
    public DateTime? To { get; set; }
    public string? State { get; set; }
    public string? RiderId { get; set; }
    public string? HubId { get; set; }
}

public class ItemStats
{
    public int Total { get; set; }
    public int Delivered { get; set; }
    public int InTransit { get; set; }
    public int Pending { get; set; }
    public int Failed { get; set; }
    public double DeliveryRate { get; set; }
    public double SuccessRate { get; set; }
    public Dictionary<string, int> StatusBreakdown { get; set; } = new();
    public Dictionary<string, int> StateBreakdown { get; set; } = new();
}