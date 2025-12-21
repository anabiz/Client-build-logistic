using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;

namespace Shared.Models;

public enum UserRole
{
    SuperAdmin,
    ClientAdmin,
    OperationsManager,
    Rider,
    Applicant
}

public enum ItemStatus
{
    Received,
    Stored,
    Dispatched,
    InTransit,
    Delivered,
    Failed
}

public class AppException : Exception
{
    public string ErrorMessage { get; set; }
    public HttpStatusCode Code { get; }
    public object Errors { get; }

    public AppException(HttpStatusCode code, string message, object errors = null)
    {
        ErrorMessage = message;
        Code = code;
        Errors = errors;
    }
    
    public AppException(HttpStatusCode code, string message, string field)
    {
        ErrorMessage = message;
        Code = code;
        Errors = new HashSet<object>
        {
            new {Field = field, Message = message}
        }.ToList();
    }
}

public class User
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public UserRole Role { get; set; }
    public string? Region { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class Item
{
    public string Id { get; set; } = string.Empty;
    public string BatchId { get; set; } = string.Empty;
    public string ItemNumber { get; set; } = string.Empty;
    public string QrCode { get; set; } = string.Empty;
    public string ApplicantName { get; set; } = string.Empty;
    public string ApplicantPhone { get; set; } = string.Empty;
    public string ApplicantEmail { get; set; } = string.Empty;
    public string DeliveryAddress { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty;
    public string Lga { get; set; } = string.Empty;
    public ItemStatus Status { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? DispatchedAt { get; set; }
    public DateTime? DeliveredAt { get; set; }
    public string? RiderId { get; set; }
    public string? HubId { get; set; }
    public DateTime? EstimatedDelivery { get; set; }
}

public class Batch
{
    public string Id { get; set; } = string.Empty;
    public string BatchNumber { get; set; } = string.Empty;
    public string ClientId { get; set; } = string.Empty;
    public int TotalItems { get; set; }
    public DateTime UploadedAt { get; set; }
    public string UploadedBy { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
}

public class Rider
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string VehicleNumber { get; set; } = string.Empty;
    public string Region { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public double Rating { get; set; }
    public int TotalDeliveries { get; set; }
    public double SuccessRate { get; set; }
}

public class Hub
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string Manager { get; set; } = string.Empty;
    public int Capacity { get; set; }
    public int CurrentLoad { get; set; }
}

public class Delivery
{
    public string Id { get; set; } = string.Empty;
    public string ItemId { get; set; } = string.Empty;
    public string RiderId { get; set; } = string.Empty;
    public ItemStatus Status { get; set; }
    public DateTime AssignedAt { get; set; }
    public DateTime? PickedUpAt { get; set; }
    public DateTime? DeliveredAt { get; set; }
    public ProofOfDelivery? ProofOfDelivery { get; set; }
    public string? FailureReason { get; set; }
}

public class ProofOfDelivery
{
    public string? Signature { get; set; }
    public string? Photo { get; set; }
    public string GpsLocation { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; }
    public string RecipientName { get; set; } = string.Empty;
}

public class AuditLog
{
    public string Id { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; }
    public string UserId { get; set; } = string.Empty;
    public string UserName { get; set; } = string.Empty;
    public string Action { get; set; } = string.Empty;
    public string? ItemId { get; set; }
    public string Details { get; set; } = string.Empty;
    public string? IpAddress { get; set; }
}