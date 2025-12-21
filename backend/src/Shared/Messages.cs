using System;
using System.Collections.Generic;

namespace Shared.Messages;

public class ItemStatusChangedEvent
{
    public string ItemId { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string? RiderId { get; set; }
    public DateTime Timestamp { get; set; }
    public string? Location { get; set; }
}

public class DeliveryAssignedEvent
{
    public string DeliveryId { get; set; } = string.Empty;
    public string ItemId { get; set; } = string.Empty;
    public string RiderId { get; set; } = string.Empty;
    public DateTime AssignedAt { get; set; }
}

public class NotificationRequest
{
    public string Type { get; set; } = string.Empty; // SMS, Email, Push
    public string Recipient { get; set; } = string.Empty;
    public string Subject { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public Dictionary<string, object>? Data { get; set; }
}

public class BatchUploadedEvent
{
    public string BatchId { get; set; } = string.Empty;
    public string ClientId { get; set; } = string.Empty;
    public int TotalItems { get; set; }
    public DateTime UploadedAt { get; set; }
}