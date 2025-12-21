using System;
using System.Threading.Tasks;
using Shared.Models;

namespace UserService.Application.Interfaces;

public interface IUserAppService
{
    Task<ApiResponse<(string token, User user)>> LoginAsync(string email, string password);
    Task<ApiResponse<(string token, User user)>> RegisterAsync(string name, string email, string password, UserRole role);
    Task<ApiResponse<PagedList<User>>> GetAllUsersAsync(PaginationRequest request);
    Task<ApiResponse<User>> GetUserByIdAsync(string id);
}