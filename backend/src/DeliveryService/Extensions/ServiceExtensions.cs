using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using DeliveryService.Data;
using DeliveryService.Domain.Interfaces;
using DeliveryService.Infrastructure.Repositories;
using DeliveryService.Application.Interfaces;
using DeliveryService.Application.Services;
using Shared.Services;

namespace DeliveryService.Extensions;

public static class ServiceExtensions
{
    public static IServiceCollection AddDeliveryServices(this IServiceCollection services, IConfiguration configuration)
    {
        // Database
        services.AddDbContext<DeliveryDbContext>(options =>
            options.UseNpgsql(configuration.GetConnectionString("DefaultConnection")));

        // Kafka
        services.AddSingleton<IKafkaService>(provider =>
            new KafkaService(configuration.GetConnectionString("Kafka")!));

        // Unit of Work and Repositories
        services.AddScoped<IDeliveryUnitOfWork, DeliveryUnitOfWork>();
        services.AddScoped<IDeliveryRepository, DeliveryRepository>();
        services.AddScoped<IRiderRepository, RiderRepository>();
        services.AddScoped<IHubRepository, HubRepository>();

        // Application Services
        services.AddScoped<IDeliveryAppService, DeliveryAppService>();
        services.AddScoped<IRiderAppService, RiderAppService>();
        services.AddScoped<IHubAppService, HubAppService>();

        return services;
    }
}