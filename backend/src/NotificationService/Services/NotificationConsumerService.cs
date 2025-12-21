using NotificationService.Services;
using Shared.Messages;
using Shared.Services;
using System.Text.Json;

namespace NotificationService.Services;

public class NotificationConsumerService : BackgroundService
{
    private readonly IKafkaService _kafkaService;
    private readonly ISmsService _smsService;
    private readonly IEmailService _emailService;
    private readonly IPushNotificationService _pushService;
    private readonly ILogger<NotificationConsumerService> _logger;
    private readonly IConfiguration _configuration;
    private readonly HttpClient _httpClient;

    public NotificationConsumerService(
        IKafkaService kafkaService,
        ISmsService smsService,
        IEmailService emailService,
        IPushNotificationService pushService,
        ILogger<NotificationConsumerService> logger,
        IConfiguration configuration,
        HttpClient httpClient)
    {
        _kafkaService = kafkaService;
        _smsService = smsService;
        _emailService = emailService;
        _pushService = pushService;
        _logger = logger;
        _configuration = configuration;
        _httpClient = httpClient;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        var consumer = await _kafkaService.CreateConsumerAsync("notification-service", 
            "item-status-changed", "delivery-assigned", "batch-uploaded");

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                var result = consumer.Consume(TimeSpan.FromSeconds(1));
                if (result != null)
                {
                    await ProcessMessage(result.Topic, result.Message.Value);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing Kafka message");
            }
        }
    }

    private async Task ProcessMessage(string topic, string message)
    {
        switch (topic)
        {
            case "item-status-changed":
                var statusEvent = JsonSerializer.Deserialize<ItemStatusChangedEvent>(message);
                await HandleItemStatusChanged(statusEvent!);
                break;
            case "delivery-assigned":
                var deliveryEvent = JsonSerializer.Deserialize<DeliveryAssignedEvent>(message);
                await HandleDeliveryAssigned(deliveryEvent!);
                break;
            case "batch-uploaded":
                var batchEvent = JsonSerializer.Deserialize<BatchUploadedEvent>(message);
                await HandleBatchUploaded(batchEvent!);
                break;
        }
    }

    private async Task HandleItemStatusChanged(ItemStatusChangedEvent statusEvent)
    {
        var message = $"Your item {statusEvent.ItemId} status has been updated to {statusEvent.Status}";
        
        try
        {
            var itemResponse = await _httpClient.GetAsync($"{_configuration["ServiceUrls:ItemService"]}/api/items/{statusEvent.ItemId}");
            if (itemResponse.IsSuccessStatusCode)
            {
                var itemJson = await itemResponse.Content.ReadAsStringAsync();
                var item = JsonSerializer.Deserialize<JsonElement>(itemJson);
                
                var applicantPhone = item.GetProperty("applicantPhone").GetString();
                var applicantEmail = item.GetProperty("applicantEmail").GetString();
                
                if (!string.IsNullOrEmpty(applicantPhone))
                    await _smsService.SendSmsAsync(applicantPhone, message);
                
                if (!string.IsNullOrEmpty(applicantEmail))
                    await _emailService.SendEmailAsync(applicantEmail, "Item Status Update", message);
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to fetch item details for {ItemId}", statusEvent.ItemId);
        }
    }

    private async Task HandleDeliveryAssigned(DeliveryAssignedEvent deliveryEvent)
    {
        var message = $"New delivery assigned: Item {deliveryEvent.ItemId}";
        
        try
        {
            var riderResponse = await _httpClient.GetAsync($"{_configuration["ServiceUrls:DeliveryService"]}/api/riders/{deliveryEvent.RiderId}");
            if (riderResponse.IsSuccessStatusCode)
            {
                var riderJson = await riderResponse.Content.ReadAsStringAsync();
                var rider = JsonSerializer.Deserialize<JsonElement>(riderJson);
                
                var riderPhone = rider.GetProperty("phone").GetString();
                var riderEmail = rider.GetProperty("email").GetString();
                
                if (!string.IsNullOrEmpty(riderPhone))
                    await _smsService.SendSmsAsync(riderPhone, message);
                
                if (!string.IsNullOrEmpty(riderEmail))
                    await _emailService.SendEmailAsync(riderEmail, "New Delivery Assignment", message);
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to fetch rider details for {RiderId}", deliveryEvent.RiderId);
        }
    }

    private async Task HandleBatchUploaded(BatchUploadedEvent batchEvent)
    {
        var subject = "New Batch Uploaded";
        var body = $"Batch {batchEvent.BatchId} with {batchEvent.TotalItems} items uploaded.";
        
        var opsEmail = _configuration["DefaultContacts:OpsEmail"];
        var opsPhone = _configuration["DefaultContacts:OpsPhone"];
        
        if (!string.IsNullOrEmpty(opsEmail))
            await _emailService.SendEmailAsync(opsEmail, subject, body);
        
        if (!string.IsNullOrEmpty(opsPhone))
            await _smsService.SendSmsAsync(opsPhone, $"New batch: {batchEvent.TotalItems} items");
    }
}