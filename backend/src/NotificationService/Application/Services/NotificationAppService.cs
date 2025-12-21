using NotificationService.Services;
using NotificationService.DTOs;
using NotificationService.Application.Interfaces;

namespace NotificationService.Application.Services;

public class NotificationAppService : INotificationAppService
{
    private readonly ISmsService _smsService;
    private readonly IEmailService _emailService;
    private readonly IPushNotificationService _pushService;

    public NotificationAppService(
        ISmsService smsService,
        IEmailService emailService,
        IPushNotificationService pushService)
    {
        _smsService = smsService;
        _emailService = emailService;
        _pushService = pushService;
    }

    public async Task<bool> SendSmsAsync(SmsRequest request)
    {
        return await _smsService.SendSmsAsync(request.PhoneNumber, request.Message);
    }

    public async Task<bool> SendEmailAsync(EmailRequest request)
    {
        return await _emailService.SendEmailAsync(request.To, request.Subject, request.Body);
    }

    public async Task<bool> SendPushAsync(PushRequest request)
    {
        return await _pushService.SendPushNotificationAsync(
            request.DeviceToken, request.Title, request.Body, request.Data);
    }
}