# Backend Services Startup Guide

## Prerequisites
- .NET 8 SDK installed
- Docker Desktop (for infrastructure services)
- PostgreSQL (if running without Docker)

## Option 1: Using Docker (Recommended)

### 1. Start Docker Desktop
Make sure Docker Desktop is running on your system.

### 2. Start Infrastructure Services
```bash
cd backend
docker-compose up -d postgres zookeeper kafka
```

### 3. Wait for Services (30 seconds)
```bash
timeout /t 30
```

### 4. Start All Microservices
```bash
docker-compose up -d
```

### 5. Access Services
- API Gateway: http://localhost:5000
- Swagger Documentation: http://localhost:5000/swagger
- User Service: http://localhost:5001
- Item Service: http://localhost:5002
- Delivery Service: http://localhost:5003
- Notification Service: http://localhost:5004

## Option 2: Development Mode (Local)

### 1. Fix Compilation Issues
The services need missing using statements. Run this to fix:
```bash
# Add missing using statements to all files
# This needs to be done manually for each service
```

### 2. Start Services Manually
```bash
# Terminal 1 - User Service
cd src/UserService
dotnet run --urls=http://localhost:5001

# Terminal 2 - Item Service  
cd src/ItemService
dotnet run --urls=http://localhost:5002

# Terminal 3 - Delivery Service
cd src/DeliveryService
dotnet run --urls=http://localhost:5003

# Terminal 4 - Notification Service
cd src/NotificationService
dotnet run --urls=http://localhost:5004

# Terminal 5 - API Gateway
cd src/ApiGateway
dotnet run --urls=http://localhost:5000
```

## Quick Start Scripts

### Windows
- `start-services.bat` - Docker mode
- `start-dev.bat` - Development mode (needs fixes)

### Verification
Once started, visit:
- http://localhost:5000/swagger - API Documentation
- http://localhost:5000 - API Gateway Health

## Troubleshooting

### Docker Issues
- Ensure Docker Desktop is running
- Check ports 5000-5004, 5432, 9092 are available

### Compilation Issues
- Missing using statements in all services
- Need to add: System, System.Threading.Tasks, System.Collections.Generic
- Need to add: Microsoft.AspNetCore.Mvc, Microsoft.Extensions.DependencyInjection

### Database Issues
- PostgreSQL must be running on port 5432
- Default credentials: postgres/postgres
- Databases will be auto-created

## Current Status
✅ All API endpoints implemented
✅ Docker configuration ready
❌ Compilation errors need fixing
❌ Missing using statements

## Next Steps
1. Start Docker Desktop
2. Run: `docker-compose up -d`
3. Access Swagger at http://localhost:5000/swagger