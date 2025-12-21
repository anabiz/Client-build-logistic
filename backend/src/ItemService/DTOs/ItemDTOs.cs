using Shared.Models;
using System.Collections.Generic;

namespace ItemService.DTOs;

public class UpdateStatusRequest
{
    public ItemStatus Status { get; set; }
}

public class CreateBatchRequest
{
    public string ClientId { get; set; } = string.Empty;
    public string UploadedBy { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public List<CreateItemRequest> Items { get; set; } = new();
}

public class CreateItemRequest
{
    public string ApplicantName { get; set; } = string.Empty;
    public string ApplicantPhone { get; set; } = string.Empty;
    public string ApplicantEmail { get; set; } = string.Empty;
    public string DeliveryAddress { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty;
    public string Lga { get; set; } = string.Empty;
}