using Microsoft.AspNetCore.Mvc;
using NotificationService.Application.Interfaces;
using NotificationService.DTOs;
using Shared.Models;
using System.Threading.Tasks;

namespace NotificationService.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SupportController : ControllerBase
{
    private readonly INotificationAppService _notificationAppService;

    public SupportController(INotificationAppService notificationAppService)
    {
        _notificationAppService = notificationAppService;
    }

    [HttpPost("contact")]
    public async Task<IActionResult> ContactSupport([FromBody] SupportRequest request)
    {
        // Send support request via email
        var emailRequest = new DTOs.EmailRequest
        {
            To = "support@clientbuild.ng",
            Subject = $"Support Request: {request.Subject}",
            Body = $"From: {request.Name} ({request.Email})\nPhone: {request.Phone}\n\nMessage:\n{request.Message}"
        };

        var result = await _notificationAppService.SendEmailAsync(emailRequest);

        return Ok(new ApiResponse<object>
        {
            Success = result,
            Message = result ? "Support request sent successfully" : "Failed to send support request"
        });
    }

    [HttpGet("info")]
    public async Task<IActionResult> GetSupportInfo()
    {
        var supportInfo = new
        {
            phone = "+234 800 CLIENT BUILD",
            email = "support@clientbuild.ng",
            hours = "Monday - Friday: 8:00 AM - 6:00 PM",
            emergencyPhone = "+234 800 EMERGENCY"
        };

        return Ok(new ApiResponse<object>
        {
            Success = true,
            Data = supportInfo
        });
    }
}