using System;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using Microsoft.EntityFrameworkCore;
using UserService.Data;
using UserService.Services;
using UserService.Domain.Interfaces;
using UserService.Infrastructure.Repositories;
using UserService.Application.Interfaces;
using UserService.Application.Services;

namespace UserService.Extensions;

public static class ServiceExtensions
{
    public static IServiceCollection AddUserServices(this IServiceCollection services, IConfiguration configuration)
    {
        // Database
        services.AddDbContext<UserDbContext>(options =>
            options.UseNpgsql(configuration.GetConnectionString("DefaultConnection")));

        // Authentication
        services.AddScoped<IAuthService, AuthService>();

        // Unit of Work and Repositories
        services.AddScoped<IUserUnitOfWork, UserUnitOfWork>();

        // Application Services
        services.AddScoped<IUserAppService, UserAppService>();

        return services;
    }
}