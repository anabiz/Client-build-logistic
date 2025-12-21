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
        if (FirebaseApp.DefaultInstance == null)
        {
            FirebaseApp.Create(new AppOptions()
            {
                Credential = GoogleCredential.FromFile(configuration["Firebase:ServiceAccountPath"])
            });
        }
        _messaging = FirebaseMessaging.DefaultInstance;
    }

    public async Task<bool> SendPushNotificationAsync(string deviceToken, string title, string body, Dictionary<string, string>? data = null)
    {
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