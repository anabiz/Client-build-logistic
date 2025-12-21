using Xunit;
using Moq;
using DeliveryService.Application.Services;
using DeliveryService.Domain.Interfaces;
using DeliveryService.DTOs;
using Shared.Models;
using Shared.Services;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DeliveryService.Tests.Application.Services;

public class DeliveryAppServiceTests
{
    private readonly Mock<IDeliveryUnitOfWork> _mockUnitOfWork;
    private readonly Mock<IKafkaService> _mockKafkaService;
    private readonly Mock<IDeliveryRepository> _mockDeliveryRepository;
    private readonly DeliveryAppService _service;

    public DeliveryAppServiceTests()
    {
        _mockUnitOfWork = new Mock<IDeliveryUnitOfWork>();
        _mockKafkaService = new Mock<IKafkaService>();
        _mockDeliveryRepository = new Mock<IDeliveryRepository>();
        
        _mockUnitOfWork.Setup(x => x.Deliveries).Returns(_mockDeliveryRepository.Object);
        
        _service = new DeliveryAppService(_mockUnitOfWork.Object, _mockKafkaService.Object);
    }

    [Fact]
    public async Task GetDeliveriesAsync_WithRiderId_ReturnsRiderDeliveries()
    {
        // Arrange
        var riderId = "rider123";
        var deliveries = new List<Delivery>
        {
            new Delivery { Id = "1", RiderId = riderId, Status = ItemStatus.InTransit }
        };
        _mockDeliveryRepository.Setup(x => x.GetByRiderIdAsync(riderId))
            .ReturnsAsync(deliveries);

        // Act
        var result = await _service.GetDeliveriesAsync(riderId);

        // Assert
        Assert.Single(result);
        Assert.Equal(riderId, result.First().RiderId);
    }

    [Fact]
    public async Task AssignDeliveryAsync_ValidRequest_CreatesDelivery()
    {
        // Arrange
        var request = new AssignDeliveryRequest
        {
            ItemId = "item123",
            RiderId = "rider123"
        };
        _mockUnitOfWork.Setup(x => x.SaveChangesAsync()).ReturnsAsync(1);

        // Act
        var result = await _service.AssignDeliveryAsync(request);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(request.ItemId, result.ItemId);
        Assert.Equal(request.RiderId, result.RiderId);
        Assert.Equal(ItemStatus.Dispatched, result.Status);
        _mockDeliveryRepository.Verify(x => x.AddAsync(It.IsAny<Delivery>()), Times.Once);
        _mockUnitOfWork.Verify(x => x.SaveChangesAsync(), Times.Once);
    }

    [Fact]
    public async Task MarkPickedUpAsync_ExistingDelivery_UpdatesStatus()
    {
        // Arrange
        var deliveryId = "delivery123";
        var delivery = new Delivery
        {
            Id = deliveryId,
            Status = ItemStatus.Dispatched
        };
        _mockDeliveryRepository.Setup(x => x.GetByIdAsync(deliveryId))
            .ReturnsAsync(delivery);

        // Act
        var result = await _service.MarkPickedUpAsync(deliveryId);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(ItemStatus.InTransit, result.Status);
        Assert.NotNull(result.PickedUpAt);
        _mockDeliveryRepository.Verify(x => x.UpdateAsync(delivery), Times.Once);
        _mockUnitOfWork.Verify(x => x.SaveChangesAsync(), Times.Once);
    }

    [Fact]
    public async Task MarkPickedUpAsync_NonExistentDelivery_ReturnsNull()
    {
        // Arrange
        var deliveryId = "nonexistent";
        _mockDeliveryRepository.Setup(x => x.GetByIdAsync(deliveryId))
            .ReturnsAsync((Delivery?)null);

        // Act
        var result = await _service.MarkPickedUpAsync(deliveryId);

        // Assert
        Assert.Null(result);
        _mockDeliveryRepository.Verify(x => x.UpdateAsync(It.IsAny<Delivery>()), Times.Never);
    }

    [Fact]
    public async Task MarkDeliveredAsync_ValidRequest_UpdatesDeliveryWithProof()
    {
        // Arrange
        var deliveryId = "delivery123";
        var delivery = new Delivery
        {
            Id = deliveryId,
            Status = ItemStatus.InTransit
        };
        var proofRequest = new ProofOfDeliveryRequest
        {
            Signature = "signature_data",
            Photo = "photo_data",
            GpsLocation = "12.345,67.890",
            RecipientName = "John Doe"
        };
        _mockDeliveryRepository.Setup(x => x.GetByIdAsync(deliveryId))
            .ReturnsAsync(delivery);

        // Act
        var result = await _service.MarkDeliveredAsync(deliveryId, proofRequest);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(ItemStatus.Delivered, result.Status);
        Assert.NotNull(result.DeliveredAt);
        Assert.NotNull(result.ProofOfDelivery);
        Assert.Equal(proofRequest.RecipientName, result.ProofOfDelivery.RecipientName);
        _mockDeliveryRepository.Verify(x => x.UpdateAsync(delivery), Times.Once);
        _mockUnitOfWork.Verify(x => x.SaveChangesAsync(), Times.Once);
    }
}