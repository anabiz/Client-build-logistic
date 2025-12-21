using System;
using System.Threading.Tasks;
using NotificationService.DTOs;

namespace NotificationService.Application.Interfaces;

public interface INotificationAppService
{
    Task<bool> SendSmsAsync(SmsRequest request);
    Task<bool> SendEmailAsync(EmailRequest request);
    Task<bool> SendPushAsync(PushRequest request);
}