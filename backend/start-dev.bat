@echo off
echo Starting Logistic Application Backend Services (Development Mode)
echo.

echo 1. Starting User Service on port 5001...
start "User Service" cmd /k "cd /d src\UserService && dotnet run --urls=http://localhost:5001"

timeout /t 3

echo 2. Starting Item Service on port 5002...
start "Item Service" cmd /k "cd /d src\ItemService && dotnet run --urls=http://localhost:5002"

timeout /t 3

echo 3. Starting Delivery Service on port 5003...
start "Delivery Service" cmd /k "cd /d src\DeliveryService && dotnet run --urls=http://localhost:5003"

timeout /t 3

echo 4. Starting Notification Service on port 5004...
start "Notification Service" cmd /k "cd /d src\NotificationService && dotnet run --urls=http://localhost:5004"

timeout /t 3

echo 5. Starting API Gateway on port 5000...
start "API Gateway" cmd /k "cd /d src\ApiGateway && dotnet run --urls=http://localhost:5000"

echo.
echo All services are starting...
echo.
echo API Gateway: http://localhost:5000
echo User Service: http://localhost:5001
echo Item Service: http://localhost:5002
echo Delivery Service: http://localhost:5003
echo Notification Service: http://localhost:5004
echo.
echo Swagger Documentation: http://localhost:5000/swagger
echo.

pause