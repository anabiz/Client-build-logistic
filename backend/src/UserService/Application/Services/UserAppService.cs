using UserService.Domain.Interfaces;
using UserService.Services;
using UserService.Application.Interfaces;
using Shared.Models;
using System;
using System.Threading.Tasks;

namespace UserService.Application.Services;

public class UserAppService : IUserAppService
{
    private readonly IUserUnitOfWork _unitOfWork;
    private readonly IAuthService _authService;

    public UserAppService(IUserUnitOfWork unitOfWork, IAuthService authService)
    {
        _unitOfWork = unitOfWork;
        _authService = authService;
    }

    public async Task<ApiResponse<(string token, User user)>> LoginAsync(string email, string password)
    {
        var user = await _unitOfWork.Users.GetByEmailAsync(email);
        if (user == null || !_authService.ValidatePassword(password, user.PasswordHash))
        {
            return new ApiResponse<(string token, User user)>
            {
                Success = false,
                Message = "Invalid credentials"
            };
        }

        var token = _authService.GenerateToken(user);
        return new ApiResponse<(string token, User user)>
        {
            Success = true,
            Message = "Login successful",
            Data = (token, user)
        };
    }

    public async Task<ApiResponse<(string token, User user)>> RegisterAsync(string name, string email, string password, UserRole role)
    {
        var existingUser = await _unitOfWork.Users.GetByEmailAsync(email);
        if (existingUser != null)
        {
            return new ApiResponse<(string token, User user)>
            {
                Success = false,
                Message = "Email already exists"
            };
        }

        var user = new User
        {
            Id = Guid.NewGuid().ToString(),
            Name = name,
            Email = email,
            Role = role,
            PasswordHash = _authService.HashPassword(password),
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        await _unitOfWork.Users.AddAsync(user);
        await _unitOfWork.SaveChangesAsync();

        var token = _authService.GenerateToken(user);
        return new ApiResponse<(string token, User user)>
        {
            Success = true,
            Message = "Registration successful",
            Data = (token, user)
        };
    }

    public async Task<ApiResponse<PagedList<User>>> GetAllUsersAsync(PaginationRequest request)
    {
        var users = await _unitOfWork.Users.GetPagedAsync(request.Page, request.PageSize);
        return new ApiResponse<PagedList<User>>(users, "Users retrieved successfully");
    }

    public async Task<ApiResponse<User>> GetUserByIdAsync(string id)
    {
        var user = await _unitOfWork.Users.GetByIdAsync(id);
        if (user == null)
        {
            return new ApiResponse<User>
            {
                Success = false,
                Message = "User not found"
            };
        }

        return new ApiResponse<User>
        {
            Success = true,
            Data = user
        };
    }
}