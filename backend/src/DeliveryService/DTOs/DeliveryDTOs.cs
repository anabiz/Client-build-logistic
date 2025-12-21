namespace DeliveryService.DTOs;

public class AssignDeliveryRequest
{
    public string ItemId { get; set; } = string.Empty;
    public string RiderId { get; set; } = string.Empty;
}

public class ProofOfDeliveryRequest
{
    public string? Signature { get; set; }
    public string? Photo { get; set; }
    public string GpsLocation { get; set; } = string.Empty;
    public string RecipientName { get; set; } = string.Empty;
}