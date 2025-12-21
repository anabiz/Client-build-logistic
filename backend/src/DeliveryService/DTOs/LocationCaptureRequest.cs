namespace DeliveryService.DTOs;

public class LocationCaptureRequest
{
    public double Latitude { get; set; }
    public double Longitude { get; set; }
    public string? Address { get; set; }
}