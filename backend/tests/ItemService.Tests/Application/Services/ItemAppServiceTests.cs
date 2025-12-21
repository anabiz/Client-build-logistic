using Xunit;
using Moq;
using ItemService.Application.Services;
using ItemService.Domain.Interfaces;
using Shared.Models;
using Shared.Services;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace ItemService.Tests.Application.Services;

public class ItemAppServiceTests
{
    private readonly Mock<IItemUnitOfWork> _mockUnitOfWork;
    private readonly Mock<IKafkaService> _mockKafkaService;
    private readonly Mock<IItemRepository> _mockItemRepository;
    private readonly ItemAppService _service;

    public ItemAppServiceTests()
    {
        _mockUnitOfWork = new Mock<IItemUnitOfWork>();
        _mockKafkaService = new Mock<IKafkaService>();
        _mockItemRepository = new Mock<IItemRepository>();
        
        _mockUnitOfWork.Setup(x => x.Items).Returns(_mockItemRepository.Object);
        
        _service = new ItemAppService(_mockUnitOfWork.Object, _mockKafkaService.Object);
    }

    [Fact]
    public async Task GetItemByIdAsync_ExistingItem_ReturnsItem()
    {
        // Arrange
        var itemId = "item123";
        var item = new Item
        {
            Id = itemId,
            ItemNumber = "CB-2024-123456",
            ApplicantName = "John Doe",
            Status = ItemStatus.Received
        };
        _mockItemRepository.Setup(x => x.GetByIdAsync(itemId))
            .ReturnsAsync(item);

        // Act
        var result = await _service.GetItemByIdAsync(itemId);

        // Assert
        Assert.True(result.Success);
        Assert.Equal(item, result.Data);
    }

    [Fact]
    public async Task GetItemByIdAsync_NonExistentItem_ReturnsFailure()
    {
        // Arrange
        var itemId = "nonexistent";
        _mockItemRepository.Setup(x => x.GetByIdAsync(itemId))
            .ReturnsAsync((Item?)null);

        // Act
        var result = await _service.GetItemByIdAsync(itemId);

        // Assert
        Assert.False(result.Success);
        Assert.Equal("Item not found", result.Message);
    }

    [Fact]
    public async Task CreateItemAsync_ValidItem_CreatesSuccessfully()
    {
        // Arrange
        var item = new Item
        {
            ApplicantName = "Jane Doe",
            ApplicantEmail = "jane@example.com",
            DeliveryAddress = "123 Main St",
            State = "Lagos",
            Lga = "Ikeja"
        };
        _mockUnitOfWork.Setup(x => x.SaveChangesAsync()).ReturnsAsync(1);

        // Act
        var result = await _service.CreateItemAsync(item);

        // Assert
        Assert.True(result.Success);
        Assert.Equal("Item created successfully", result.Message);
        Assert.NotNull(result.Data.Id);
        Assert.Equal(ItemStatus.Received, result.Data.Status);
        _mockItemRepository.Verify(x => x.AddAsync(It.IsAny<Item>()), Times.Once);
        _mockUnitOfWork.Verify(x => x.SaveChangesAsync(), Times.Once);
    }

    [Fact]
    public async Task UpdateItemStatusAsync_ExistingItem_UpdatesStatus()
    {
        // Arrange
        var itemId = "item123";
        var item = new Item
        {
            Id = itemId,
            Status = ItemStatus.Received
        };
        var newStatus = ItemStatus.Dispatched;
        _mockItemRepository.Setup(x => x.GetByIdAsync(itemId))
            .ReturnsAsync(item);
        _mockUnitOfWork.Setup(x => x.SaveChangesAsync()).ReturnsAsync(1);

        // Act
        var result = await _service.UpdateItemStatusAsync(itemId, newStatus);

        // Assert
        Assert.True(result.Success);
        Assert.Equal("Item status updated successfully", result.Message);
        Assert.Equal(newStatus, result.Data.Status);
        Assert.NotNull(result.Data.DispatchedAt);
        _mockItemRepository.Verify(x => x.UpdateAsync(item), Times.Once);
        _mockUnitOfWork.Verify(x => x.SaveChangesAsync(), Times.Once);
    }

    [Fact]
    public async Task UpdateItemStatusAsync_NonExistentItem_ReturnsFailure()
    {
        // Arrange
        var itemId = "nonexistent";
        var newStatus = ItemStatus.Dispatched;
        _mockItemRepository.Setup(x => x.GetByIdAsync(itemId))
            .ReturnsAsync((Item?)null);

        // Act
        var result = await _service.UpdateItemStatusAsync(itemId, newStatus);

        // Assert
        Assert.False(result.Success);
        Assert.Equal("Item not found", result.Message);
        _mockItemRepository.Verify(x => x.UpdateAsync(It.IsAny<Item>()), Times.Never);
    }

    [Fact]
    public async Task GetDashboardStatsAsync_WithItems_ReturnsCorrectStats()
    {
        // Arrange
        var items = new List<Item>
        {
            new Item { Status = ItemStatus.Delivered },
            new Item { Status = ItemStatus.Delivered },
            new Item { Status = ItemStatus.InTransit },
            new Item { Status = ItemStatus.Received },
            new Item { Status = ItemStatus.Failed }
        };
        _mockItemRepository.Setup(x => x.GetAllAsync())
            .ReturnsAsync(items);

        // Act
        var result = await _service.GetDashboardStatsAsync();

        // Assert
        Assert.True(result.Success);
        var stats = result.Data;
        Assert.Equal(5, ((dynamic)stats).total);
        Assert.Equal(2, ((dynamic)stats).delivered);
        Assert.Equal(1, ((dynamic)stats).inTransit);
        Assert.Equal(1, ((dynamic)stats).pending);
        Assert.Equal(1, ((dynamic)stats).failed);
        Assert.Equal(40.0, ((dynamic)stats).deliveryRate);
    }
}