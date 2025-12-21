using NotificationService.Services;
using NotificationService.Application.Interfaces;
using NotificationService.Application.Services;
using Shared.Services;

namespace NotificationService.Extensions;

public static class ServiceExtensions
{
    public static IServiceCollection AddNotificationServices(this IServiceCollection services, IConfiguration configuration)
    {
        // HTTP Clients
        services.AddHttpClient<ISmsService, TermiiSmsService>();
        services.AddHttpClient<NotificationConsumerService>();

        // Notification Services
        services.AddScoped<IEmailService, EmailService>();
        services.AddScoped<IPushNotificationService, FirebasePushNotificationService>();
        services.AddScoped<INotificationAppService, NotificationAppService>();

        // Kafka
        services.AddSingleton<IKafkaService>(provider =>
            new KafkaService(configuration.GetConnectionString("Kafka")!));

        // Background Services
        services.AddHostedService<NotificationConsumerService>();

        return services;
    }
}