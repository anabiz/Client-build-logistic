using Microsoft.AspNetCore.Mvc;
using Shared.Controllers;
using Shared.Models;
using Confluent.Kafka;
using Confluent.Kafka.Admin;

namespace NotificationService.Controllers;

[ApiController]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/[controller]")]
public class KafkaMonitorController : BaseController
{
    private readonly IConfiguration _configuration;

    public KafkaMonitorController(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    [HttpGet("topics")]
    public async Task<ActionResult<ApiResponse<List<string>>>> GetTopics()
    {
        try
        {
            var config = new AdminClientConfig
            {
                BootstrapServers = _configuration.GetConnectionString("Kafka")
            };

            using var adminClient = new AdminClientBuilder(config).Build();
            var metadata = adminClient.GetMetadata(TimeSpan.FromSeconds(10));
            var topics = metadata.Topics.Select(t => t.Topic).ToList();

            return Success(topics);
        }
        catch (Exception ex)
        {
            return Error($"Failed to get topics: {ex.Message}");
        }
    }

    [HttpGet("consumer-groups")]
    public async Task<ActionResult<ApiResponse<List<object>>>> GetConsumerGroups()
    {
        try
        {
            var config = new AdminClientConfig
            {
                BootstrapServers = _configuration.GetConnectionString("Kafka")
            };

            using var adminClient = new AdminClientBuilder(config).Build();
            var groups = await adminClient.ListGroupsAsync(TimeSpan.FromSeconds(10));
            
            var result = groups.Valid.Select(g => new { 
                GroupId = g.Group, 
                Type = g.Type.ToString() 
            }).ToList<object>();

            return Success(result);
        }
        catch (Exception ex)
        {
            return Error($"Failed to get consumer groups: {ex.Message}");
        }
    }
}