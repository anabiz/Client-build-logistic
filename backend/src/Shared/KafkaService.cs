using Confluent.Kafka;
using System;
using System.Text.Json;
using System.Threading.Tasks;

namespace Shared.Services;

public interface IKafkaService
{
    Task PublishAsync<T>(string topic, T message);
    Task<IConsumer<string, string>> CreateConsumerAsync(string groupId, params string[] topics);
}

public class KafkaService : IKafkaService
{
    private readonly IProducer<string, string> _producer;
    private readonly ProducerConfig _producerConfig;
    private readonly ConsumerConfig _consumerConfig;

    public KafkaService(string bootstrapServers)
    {
        _producerConfig = new ProducerConfig
        {
            BootstrapServers = bootstrapServers
        };

        _consumerConfig = new ConsumerConfig
        {
            BootstrapServers = bootstrapServers,
            AutoOffsetReset = AutoOffsetReset.Earliest
        };

        _producer = new ProducerBuilder<string, string>(_producerConfig).Build();
    }

    public async Task PublishAsync<T>(string topic, T message)
    {
        var json = JsonSerializer.Serialize(message);
        await _producer.ProduceAsync(topic, new Message<string, string>
        {
            Key = Guid.NewGuid().ToString(),
            Value = json
        });
    }

    public Task<IConsumer<string, string>> CreateConsumerAsync(string groupId, params string[] topics)
    {
        var config = new ConsumerConfig(_consumerConfig)
        {
            GroupId = groupId
        };

        var consumer = new ConsumerBuilder<string, string>(config).Build();
        consumer.Subscribe(topics);
        return Task.FromResult(consumer);
    }
}