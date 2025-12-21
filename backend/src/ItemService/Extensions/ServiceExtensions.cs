using System;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using Microsoft.EntityFrameworkCore;
using ItemService.Data;
using ItemService.Domain.Interfaces;
using ItemService.Infrastructure.Repositories;
using ItemService.Application.Interfaces;
using ItemService.Application.Services;
using Shared.Services;

namespace ItemService.Extensions;

public static class ServiceExtensions
{
    public static IServiceCollection AddItemServices(this IServiceCollection services, IConfiguration configuration)
    {
        // Database - Use PostgreSQL
        services.AddDbContext<ItemDbContext>(options =>
            options.UseNpgsql(configuration.GetConnectionString("DefaultConnection")));

        // Kafka - Mock for now
        services.AddSingleton<IKafkaService>(provider => new MockKafkaService());

        // Unit of Work and Repositories
        services.AddScoped<IItemUnitOfWork, ItemUnitOfWork>();

        // Application Services
        services.AddScoped<IItemAppService, ItemAppService>();
        services.AddScoped<IBatchAppService, BatchAppService>();

        return services;
    }

    // Mock Kafka Service for development
    public class MockKafkaService : IKafkaService
    {
        public Task PublishAsync<T>(string topic, T message)
        {
            Console.WriteLine($"Mock Kafka: Publishing to {topic}: {System.Text.Json.JsonSerializer.Serialize(message)}");
            return Task.CompletedTask;
        }

        public Task<Confluent.Kafka.IConsumer<string, string>> CreateConsumerAsync(string groupId, params string[] topics)
        {
            Console.WriteLine($"Mock Kafka: Creating consumer for group {groupId} with topics: {string.Join(", ", topics)}");
            return Task.FromResult<Confluent.Kafka.IConsumer<string, string>>(null!);
        }
    }
}