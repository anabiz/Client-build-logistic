using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using NotificationService.Services;

namespace NotificationService.Controllers;

[ApiController]
[Route("api/[controller]")]
public class NotificationsController : ControllerBase
{
    private readonly ISmsService _smsService;
    private readonly IEmailService _emailService;
    private readonly IPushNotificationService _pushService;

    public NotificationsController(
        ISmsService smsService,
        IEmailService emailService,
        IPushNotificationService pushService)
    {
        _smsService = smsService;
        _emailService = emailService;
        _pushService = pushService;
    }

    [HttpPost("sms")]
    public async Task<IActionResult> SendSms([FromBody] SmsRequest request)
    {
        var result = await _smsService.SendSmsAsync(request.PhoneNumber, request.Message);
        return Ok(new { success = result });
    }

    [HttpPost("email")]
    public async Task<IActionResult> SendEmail([FromBody] EmailRequest request)
    {
        var result = await _emailService.SendEmailAsync(request.To, request.Subject, request.Body);
        return Ok(new { success = result });
    }

    [HttpPost("push")]
    public async Task<IActionResult> SendPush([FromBody] PushRequest request)
    {
        var result = await _pushService.SendPushNotificationAsync(
            request.DeviceToken, request.Title, request.Body, request.Data);
        return Ok(new { success = result });
    }
}

public class SmsRequest
{
    public string PhoneNumber { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
}

public class EmailRequest
{
    public string To { get; set; } = string.Empty;
    public string Subject { get; set; } = string.Empty;
    public string Body { get; set; } = string.Empty;
}

public class PushRequest
{
    public string DeviceToken { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Body { get; set; } = string.Empty;
    public Dictionary<string, string>? Data { get; set; }
}