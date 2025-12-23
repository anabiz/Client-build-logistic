namespace DeliveryService.DTOs;

public class RiderPerformanceDto
{
    public string RiderId { get; set; } = string.Empty;
    public string RiderName { get; set; } = string.Empty;
    public int OnTimeDeliveries { get; set; }
    public int LateDeliveries { get; set; }
    public double SlaCompliance { get; set; }
    public double AvgDeliveryTime { get; set; }
    public double TargetDeliveryTime { get; set; } = 2.5;
    public string Status { get; set; } = string.Empty;
    public string Region { get; set; } = string.Empty;
}

public class DeliveryHistoryDto
{
    public string DeliveryId { get; set; } = string.Empty;
    public string ItemId { get; set; } = string.Empty;
    public DateTime AssignedDate { get; set; }
    public DateTime? DeliveredDate { get; set; }
    public string Status { get; set; } = string.Empty;
    public double DeliveryTimeInDays { get; set; }
    public bool IsOnTime { get; set; }
}

public class PerformanceSummaryDto
{
    public double AverageSlaCompliance { get; set; }
    public int TotalOnTimeDeliveries { get; set; }
    public int TotalLateDeliveries { get; set; }
    public int TopPerformersCount { get; set; }
    public double LateDeliveryPercentage { get; set; }
}