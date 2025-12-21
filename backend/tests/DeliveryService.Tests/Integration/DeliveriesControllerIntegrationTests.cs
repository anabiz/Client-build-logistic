using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;
using DeliveryService.Data;
using Shared.Models;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using Xunit;
using System.Threading.Tasks;
using System.Net;
using System.Linq;

namespace DeliveryService.Tests.Integration;

public class DeliveriesControllerIntegrationTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory;
    private readonly HttpClient _client;

    public DeliveriesControllerIntegrationTests(WebApplicationFactory<Program> factory)
    {
        _factory = factory.WithWebHostBuilder(builder =>
        {
            builder.ConfigureServices(services =>
            {
                var descriptor = services.SingleOrDefault(d => d.ServiceType == typeof(DbContextOptions<DeliveryDbContext>));
                if (descriptor != null)
                    services.Remove(descriptor);

                services.AddDbContext<DeliveryDbContext>(options =>
                    options.UseInMemoryDatabase("TestDb"));
            });
        });
        _client = _factory.CreateClient();
    }

    [Fact]
    public async Task GetDeliveries_ReturnsOkResult()
    {
        // Act
        var response = await _client.GetAsync("/api/deliveries");

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task AssignDelivery_ValidRequest_ReturnsCreatedDelivery()
    {
        // Arrange
        var request = new
        {
            ItemId = "item123",
            RiderId = "rider123"
        };
        var json = JsonSerializer.Serialize(request);
        var content = new StringContent(json, Encoding.UTF8, "application/json");

        // Act
        var response = await _client.PostAsync("/api/deliveries/assign", content);

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var responseContent = await response.Content.ReadAsStringAsync();
        Assert.Contains("item123", responseContent);
        Assert.Contains("rider123", responseContent);
    }
}