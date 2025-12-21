using Xunit;
using Moq;
using UserService.Application.Services;
using UserService.Domain.Interfaces;
using UserService.Services;
using Shared.Models;
using System;
using System.Threading.Tasks;

namespace UserService.Tests.Application.Services;

public class UserAppServiceTests
{
    private readonly Mock<IUserUnitOfWork> _mockUnitOfWork;
    private readonly Mock<IAuthService> _mockAuthService;
    private readonly Mock<IUserRepository> _mockUserRepository;
    private readonly UserAppService _service;

    public UserAppServiceTests()
    {
        _mockUnitOfWork = new Mock<IUserUnitOfWork>();
        _mockAuthService = new Mock<IAuthService>();
        _mockUserRepository = new Mock<IUserRepository>();
        
        _mockUnitOfWork.Setup(x => x.Users).Returns(_mockUserRepository.Object);
        
        _service = new UserAppService(_mockUnitOfWork.Object, _mockAuthService.Object);
    }

    [Fact]
    public async Task LoginAsync_ValidCredentials_ReturnsSuccessWithToken()
    {
        // Arrange
        var email = "test@example.com";
        var password = "password123";
        var user = new User
        {
            Id = "user123",
            Email = email,
            PasswordHash = "hashedpassword",
            Name = "Test User",
            Role = UserRole.ClientAdmin
        };
        var token = "jwt_token_here";

        _mockUserRepository.Setup(x => x.GetByEmailAsync(email))
            .ReturnsAsync(user);
        _mockAuthService.Setup(x => x.ValidatePassword(password, user.PasswordHash))
            .Returns(true);
        _mockAuthService.Setup(x => x.GenerateToken(user))
            .Returns(token);

        // Act
        var result = await _service.LoginAsync(email, password);

        // Assert
        Assert.True(result.Success);
        Assert.Equal("Login successful", result.Message);
        Assert.Equal(token, result.Data.token);
        Assert.Equal(user, result.Data.user);
    }

    [Fact]
    public async Task LoginAsync_InvalidCredentials_ReturnsFailure()
    {
        // Arrange
        var email = "test@example.com";
        var password = "wrongpassword";
        _mockUserRepository.Setup(x => x.GetByEmailAsync(email))
            .ReturnsAsync((User?)null);

        // Act
        var result = await _service.LoginAsync(email, password);

        // Assert
        Assert.False(result.Success);
        Assert.Equal("Invalid credentials", result.Message);
    }

    [Fact]
    public async Task RegisterAsync_NewUser_CreatesUserSuccessfully()
    {
        // Arrange
        var name = "New User";
        var email = "new@example.com";
        var password = "password123";
        var role = UserRole.Rider;
        var hashedPassword = "hashed_password";
        var token = "jwt_token";

        _mockUserRepository.Setup(x => x.GetByEmailAsync(email))
            .ReturnsAsync((User?)null);
        _mockAuthService.Setup(x => x.HashPassword(password))
            .Returns(hashedPassword);
        _mockAuthService.Setup(x => x.GenerateToken(It.IsAny<User>()))
            .Returns(token);
        _mockUnitOfWork.Setup(x => x.SaveChangesAsync())
            .ReturnsAsync(1);

        // Act
        var result = await _service.RegisterAsync(name, email, password, role);

        // Assert
        Assert.True(result.Success);
        Assert.Equal("Registration successful", result.Message);
        Assert.Equal(token, result.Data.token);
        Assert.Equal(email, result.Data.user.Email);
        _mockUserRepository.Verify(x => x.AddAsync(It.IsAny<User>()), Times.Once);
        _mockUnitOfWork.Verify(x => x.SaveChangesAsync(), Times.Once);
    }

    [Fact]
    public async Task RegisterAsync_ExistingEmail_ReturnsFailure()
    {
        // Arrange
        var name = "New User";
        var email = "existing@example.com";
        var password = "password123";
        var role = UserRole.Rider;
        var existingUser = new User { Email = email };

        _mockUserRepository.Setup(x => x.GetByEmailAsync(email))
            .ReturnsAsync(existingUser);

        // Act
        var result = await _service.RegisterAsync(name, email, password, role);

        // Assert
        Assert.False(result.Success);
        Assert.Equal("Email already exists", result.Message);
        _mockUserRepository.Verify(x => x.AddAsync(It.IsAny<User>()), Times.Never);
    }

    [Fact]
    public async Task GetUserByIdAsync_ExistingUser_ReturnsUser()
    {
        // Arrange
        var userId = "user123";
        var user = new User
        {
            Id = userId,
            Name = "Test User",
            Email = "test@example.com"
        };
        _mockUserRepository.Setup(x => x.GetByIdAsync(userId))
            .ReturnsAsync(user);

        // Act
        var result = await _service.GetUserByIdAsync(userId);

        // Assert
        Assert.True(result.Success);
        Assert.Equal(user, result.Data);
    }

    [Fact]
    public async Task GetUserByIdAsync_NonExistentUser_ReturnsFailure()
    {
        // Arrange
        var userId = "nonexistent";
        _mockUserRepository.Setup(x => x.GetByIdAsync(userId))
            .ReturnsAsync((User?)null);

        // Act
        var result = await _service.GetUserByIdAsync(userId);

        // Assert
        Assert.False(result.Success);
        Assert.Equal("User not found", result.Message);
    }
}