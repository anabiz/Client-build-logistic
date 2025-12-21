using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;

namespace NotificationService.Services;

public interface ISmsService
{
    Task<bool> SendSmsAsync(string phoneNumber, string message);
}

public class TermiiSmsService : ISmsService
{
    private readonly HttpClient _httpClient;
    private readonly string _apiKey;
    private readonly string _senderId;

    public TermiiSmsService(HttpClient httpClient, IConfiguration configuration)
    {
        _httpClient = httpClient;
        _apiKey = configuration["Termii:ApiKey"]!;
        _senderId = configuration["Termii:SenderId"]!;
    }

    public async Task<bool> SendSmsAsync(string phoneNumber, string message)
    {
        try
        {
            var payload = new
            {
                to = phoneNumber,
                from = _senderId,
                sms = message,
                type = "plain",
                api_key = _apiKey,
                channel = "generic"
            };

            var json = JsonSerializer.Serialize(payload);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var response = await _httpClient.PostAsync("https://api.ng.termii.com/api/sms/send", content);
            return response.IsSuccessStatusCode;
        }
        catch
        {
            return false;
        }
    }
}