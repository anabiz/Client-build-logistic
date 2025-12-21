@echo off
echo Setting up Logistic Application Backend...

echo.
echo 1. Starting infrastructure services (PostgreSQL, Kafka)...
docker-compose up -d postgres zookeeper kafka

echo.
echo 2. Waiting for services to be ready...
timeout /t 30

echo.
echo 3. Building and starting microservices...
docker-compose up -d

echo.
echo 4. Services are starting up...
echo.
echo API Gateway: http://localhost:5000
echo User Service: http://localhost:5001
echo Item Service: http://localhost:5002  
echo Delivery Service: http://localhost:5003
echo Notification Service: http://localhost:5004
echo.
echo Hangfire Dashboard: http://localhost:5002/hangfire
echo.
echo To view logs: docker-compose logs -f [service-name]
echo To stop all services: docker-compose down

pause