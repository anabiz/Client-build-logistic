# Logistic Application

A comprehensive logistics management system built with React (Vite) frontend and .NET 8 microservices backend, designed specifically for the Nigerian market.

## Architecture Overview

### Clean Architecture Diagram

**System Architecture Overview:**
```
FRONTEND (React + Vite + TypeScript) - Port: 5173
    |
    | HTTP/REST
    |
API GATEWAY (Ocelot + Swagger) - Port: 5000
    |
    +-- USER SERVICE (Port: 5001) --> PostgreSQL (Users DB)
    +-- ITEM SERVICE (Port: 5002) --> PostgreSQL (Items DB) + Hangfire
    +-- DELIVERY SERVICE (Port: 5003) --> PostgreSQL (Delivery DB)
    +-- NOTIFICATION SERVICE (Port: 5004) --> External APIs
    |
    | Kafka Events
    |
KAFKA BROKER (Port: 9092)
    |
EXTERNAL SERVICES:
- Termii SMS (Nigerian SMS Provider)
- Firebase Push Notifications  
- MailKit Email Service
```

**Clean Architecture Layers (Per Microservice):**
```
+--------------------------------------------------+
|              PRESENTATION LAYER                  |
| - Controllers (API Endpoints)                    |
| - DTOs (Data Transfer Objects)                   |
| - Extensions (Service Registration)              |
| - Program.cs (Application Entry Point)          |
+--------------------------------------------------+
                        |
                        | Dependency Injection
                        v
+--------------------------------------------------+
|              APPLICATION LAYER                   |
| - Application Services (Business Logic)         |
| - Interfaces (Service Contracts)                |
| - Use Cases (Business Operations)               |
| - Command/Query Handlers                        |
+--------------------------------------------------+
                        |
                        | Interface Segregation
                        v
+--------------------------------------------------+
|                DOMAIN LAYER                      |
| - Entities (Business Models)                    |
| - Repository Interfaces                         |
| - Unit of Work Interfaces                       |
| - Domain Services                               |
+--------------------------------------------------+
                        |
                        | Dependency Inversion
                        v
+--------------------------------------------------+
|            INFRASTRUCTURE LAYER                  |
| - Repository Implementations                     |
| - Unit of Work Implementation                    |
| - Database Context (Entity Framework)           |
| - External Service Integrations                 |
| - Kafka Services                                |
+--------------------------------------------------+
```

**Data Flow Architecture:**
```
CLIENT (React) --> API GATEWAY (Ocelot) --> MICROSERVICE (Clean Arch) --> DATABASE (PostgreSQL)
                                                    |
                                                    v
                                            KAFKA (Events)
                                                    |
                                                    v
                                        NOTIFICATION SERVICE
```

### Frontend
- **React 18** with **Vite** for fast development
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Modern UI components** and responsive design

### Backend - Microservices Architecture
- **.NET 8** with **Clean Architecture** pattern
- **Unit of Work & Repository** patterns for data access
- **PostgreSQL** databases per service
- **Apache Kafka** for inter-service communication
- **Ocelot API Gateway** with **Swagger documentation**
- **Docker containerization** for all services

## Services

### 1. API Gateway (Port: 5000)
- **Ocelot-based** routing and load balancing
- **Swagger UI** at `/swagger` for API documentation
- **CORS configuration** for frontend integration
- **JWT authentication** middleware

### 2. User Service (Port: 5001)
- **Authentication & Authorization** with JWT
- **User management** (SuperAdmin, ClientAdmin, OperationsManager, Rider, Applicant)
- **Clean Architecture** with separated interfaces
- **PostgreSQL database** with Entity Framework Core

### 3. Item Service (Port: 5002)
- **Item and Batch management**
- **QR code generation** for tracking
- **Hangfire background jobs** for processing
- **Analytics endpoints** for dashboard metrics
- **Transaction support** for batch operations

### 4. Delivery Service (Port: 5003)
- **Delivery assignment and tracking**
- **Rider management** with availability status
- **Hub management** for logistics centers
- **Proof of delivery** with GPS and signatures
- **Real-time status updates** via Kafka events

### 5. Notification Service (Port: 5004)
- **Multi-channel notifications**: SMS, Email, Push
- **Termii SMS integration** (Nigerian provider)
- **MailKit email service**
- **Firebase push notifications**
- **Kafka consumer** for event-driven notifications

### 6. Shared Library
- **Common models** and DTOs
- **Repository interfaces** and base implementations
- **Kafka service** for messaging
- **API response models** with pagination
- **Domain interfaces** for consistency

## Key Features

### Nigerian Market Optimization
- **Termii SMS service** for reliable SMS delivery
- **State and LGA support** for Nigerian addresses
- **Local phone number formats** and validation
- **Naira currency** considerations

### Clean Architecture Implementation
- **Domain Layer**: Entities, interfaces, business rules
- **Application Layer**: Use cases, DTOs, service interfaces
- **Infrastructure Layer**: Repositories, external services
- **Presentation Layer**: Controllers, API endpoints

### Data Patterns
- **Unit of Work pattern** for transaction management
- **Repository pattern** for data access abstraction
- **CQRS-ready** structure for future scaling
- **Entity Framework Core** with PostgreSQL

### API Standards
- **Consistent response format** across all endpoints
- **Pagination support** for list endpoints
- **Error handling** with structured responses
- **Swagger documentation** for all APIs

## Running the Application

### Prerequisites
- **Node.js 18+** for frontend
- **.NET 8 SDK** for backend
- **Docker & Docker Compose** for services
- **PostgreSQL** (via Docker)
- **Apache Kafka** (via Docker)

### Frontend Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Access at http://localhost:5173
```

### Backend Setup
```bash
# Navigate to backend directory
cd backend

# Start all services with Docker Compose
docker-compose up -d

# Or run individual services
dotnet run --project src/ApiGateway
dotnet run --project src/UserService
dotnet run --project src/ItemService
dotnet run --project src/DeliveryService
dotnet run --project src/NotificationService
```

### Service Endpoints
- **API Gateway**: http://localhost:5000
- **Swagger Documentation**: http://localhost:5000/swagger
- **User Service**: http://localhost:5001
- **Item Service**: http://localhost:5002
- **Delivery Service**: http://localhost:5003
- **Notification Service**: http://localhost:5004

## Database Schema

### User Service Database
- **Users**: Authentication and role management
- **Audit logs**: User activity tracking

### Item Service Database
- **Items**: Individual package tracking
- **Batches**: Bulk upload management
- **Analytics**: Performance metrics

### Delivery Service Database
- **Deliveries**: Assignment and status tracking
- **Riders**: Delivery personnel management
- **Hubs**: Distribution center management

## Configuration

### Environment Variables
```bash
# Database connections
ConnectionStrings__DefaultConnection=Host=localhost;Database=LogisticApp;Username=postgres;Password=password

# Kafka configuration
ConnectionStrings__Kafka=localhost:9092

# Termii SMS (Nigerian SMS provider)
Termii__ApiKey=your_termii_api_key
Termii__SenderId=your_sender_id

# Email configuration
Email__SmtpHost=smtp.gmail.com
Email__SmtpPort=587
Email__Username=your_email
Email__Password=your_password

# Firebase push notifications
Firebase__ProjectId=your_project_id
Firebase__PrivateKey=your_private_key
```

## Development Guidelines

### Code Organization
- **Separate files** for each interface and implementation
- **Clean Architecture** layers strictly enforced
- **Dependency injection** for all services
- **Async/await** patterns throughout

### API Design
- **RESTful endpoints** with proper HTTP verbs
- **Consistent naming** conventions
- **Pagination** for list endpoints
- **Error responses** with meaningful messages

### Testing Strategy
- **Unit tests** for business logic
- **Integration tests** for API endpoints
- **Repository mocking** for isolated testing
- **Test containers** for database testing

## Deployment

### Docker Deployment
```bash
# Build and deploy all services
docker-compose -f docker-compose.prod.yml up -d

# Scale specific services
docker-compose up -d --scale delivery-service=3
```

### Production Considerations
- **Load balancing** via API Gateway
- **Database migrations** automated
- **Health checks** for all services
- **Logging** with structured format
- **Monitoring** with metrics collection

## Contributing

1. Follow **Clean Architecture** principles
2. Maintain **separation of concerns**
3. Write **comprehensive tests**
4. Update **API documentation**
5. Follow **Nigerian market** requirements

## License

This project is licensed under the MIT License.

## Original Design

Based on the Figma design: https://www.figma.com/design/KLB6pX5su6dHvwNtAVDdfH/Logistic-Application