using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DeliveryService.Application.Validators;

public class ValidationResult
{
    public bool IsValid { get; set; }
    public List<ValidationError> Errors { get; set; } = new();
}

public class ValidationError
{
    public string PropertyName { get; set; } = string.Empty;
    public string ErrorMessage { get; set; } = string.Empty;
}

public class AssignDeliveryRequestValidator
{
    public Task<ValidationResult> ValidateAsync(DeliveryService.DTOs.AssignDeliveryRequest request)
    {
        var result = new ValidationResult { IsValid = true };

        if (string.IsNullOrEmpty(request.ItemId))
        {
            result.IsValid = false;
            result.Errors.Add(new ValidationError { PropertyName = "ItemId", ErrorMessage = "ItemId is required" });
        }

        if (string.IsNullOrEmpty(request.RiderId))
        {
            result.IsValid = false;
            result.Errors.Add(new ValidationError { PropertyName = "RiderId", ErrorMessage = "RiderId is required" });
        }

        return Task.FromResult(result);
    }
}

public class ProofOfDeliveryRequestValidator
{
    public Task<ValidationResult> ValidateAsync(DeliveryService.DTOs.ProofOfDeliveryRequest request)
    {
        var result = new ValidationResult { IsValid = true };

        if (string.IsNullOrEmpty(request.GpsLocation))
        {
            result.IsValid = false;
            result.Errors.Add(new ValidationError { PropertyName = "GpsLocation", ErrorMessage = "GPS location is required" });
        }

        if (string.IsNullOrEmpty(request.RecipientName))
        {
            result.IsValid = false;
            result.Errors.Add(new ValidationError { PropertyName = "RecipientName", ErrorMessage = "Recipient name is required" });
        }

        return Task.FromResult(result);
    }
}