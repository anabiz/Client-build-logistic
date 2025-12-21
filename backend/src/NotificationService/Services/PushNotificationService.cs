using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using FirebaseAdmin;
using FirebaseAdmin.Messaging;
using Google.Apis.Auth.OAuth2;

namespace NotificationService.Services;

public interface IPushNotificationService
{
    Task<bool> SendPushNotificationAsync(string deviceToken, string title, string body, Dictionary<string, string>? data = null);
}

public class FirebasePushNotificationService : IPushNotificationService
{
    private readonly FirebaseMessaging _messaging;

    public FirebasePushNotificationService(IConfiguration configuration)
    {
        var serviceAccountPath = configuration["Firebase:ServiceAccountPath"];
        if (!string.IsNullOrEmpty(serviceAccountPath) && File.Exists(serviceAccountPath))
        {
            if (FirebaseApp.DefaultInstance == null)
            {
                FirebaseApp.Create(new AppOptions()
                {
                    Credential = GoogleCredential.FromFile(serviceAccountPath)
                });
            }
            _messaging = FirebaseMessaging.DefaultInstance;
        }
        else
        {
            _messaging = null!; // Firebase not configured
        }
    }

    public async Task<bool> SendPushNotificationAsync(string deviceToken, string title, string body, Dictionary<string, string>? data = null)
    {
        if (_messaging == null)
        {
            // Firebase not configured, return false
            return false;
        }
        
        try
        {
            var message = new Message()
            {
                Token = deviceToken,
                Notification = new Notification()
                {
                    Title = title,
                    Body = body
                },
                Data = data
            };

            await _messaging.SendAsync(message);
            return true;
        }
        catch
        {
            return false;
        }
    }
}