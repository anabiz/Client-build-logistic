@echo off
echo Setting up Logistic Application Backend...
echo.

echo 1. Restoring NuGet packages...
dotnet restore LogisticApplication.sln

echo.
echo 2. Building all services...
dotnet build LogisticApplication.sln

echo.
echo 3. Setup complete!
echo.
echo To start services:
echo - Docker: run "docker-compose up -d" 
echo - Development: run "start-dev.bat"
echo.

pause