# Logistic Application - Enhanced Version

## Overview
A comprehensive .NET 8 microservice backend with React Vite frontend for logistics management, featuring advanced pagination, filtering, search capabilities, and monitoring.

## Architecture

### Backend (.NET 8 Microservices)
- **API Gateway** (Ocelot) - Port 5000
- **User Service** - Port 5001 (Authentication, Users, Audit Logs)
- **Item Service** - Port 5002 (Items, Batches, Analytics)
- **Delivery Service** - Port 5003 (Deliveries, Riders, Hubs)
- **Notification Service** - Port 5004 (SMS, Email, Push, Kafka Monitoring)

### Frontend (React + Vite + TypeScript)
- **Modern UI** with Tailwind CSS and shadcn/ui
- **Advanced Pagination** with configurable page sizes
- **Multi-field Search** with real-time filtering
- **Mobile-responsive** design with card/table views
- **Role-based Access** for different user types

### Infrastructure
- **PostgreSQL** - Primary database
- **Apache Kafka** - Event streaming and messaging
- **Prometheus** - Metrics collection
- **Grafana** - Monitoring dashboards
- **Kafka UI** - Queue monitoring interface

## Enhanced Features

### Advanced Pagination
- **Configurable Page Sizes**: 5, 10, 25, 50, 100 items
- **Smart Navigation**: First, Previous, Page Numbers, Next, Last
- **Ellipsis Display**: For large datasets (1...5,6,7...20)
- **Result Summary**: "Showing 1 to 10 of 150 results"
- **Mobile Optimization**: Simplified controls for touch devices

### Comprehensive Filtering
- **Multi-field Search**: Item numbers, names, QR codes, phones
- **Status Filtering**: All delivery statuses with visual badges
- **Geographic Filtering**: Nigerian states and LGAs (cascading)
- **Date Range Filtering**: Creation dates, delivery dates
- **Performance Filtering**: Rider ratings, success rates
- **Real-time Updates**: 300ms debounced search

### Mobile Responsiveness
- **Adaptive Layouts**: Card view for mobile, table for desktop
- **Touch Optimization**: Larger touch targets, swipe gestures
- **Progressive Disclosure**: Essential info first, details on demand
- **Responsive Pagination**: Simplified mobile controls

## Quick Start

### Prerequisites
- .NET 8 SDK
- Node.js 18+
- Docker & Docker Compose
- PostgreSQL (via Docker)

### Backend Setup
```bash
cd backend
docker-compose up -d  # Starts all services + monitoring
```

### Frontend Setup
```bash
npm install
npm run dev
```

### Access Points
- **Frontend**: http://localhost:5173
- **API Gateway**: http://localhost:5000
- **Swagger Docs**: http://localhost:5000/swagger
- **Grafana**: http://localhost:3000 (admin/admin123)
- **Prometheus**: http://localhost:9090
- **Kafka UI**: http://localhost:8080

## Enhanced API Endpoints

### Items Service
- `GET /api/v1/items` - Advanced filtering and pagination
- `GET /api/v1/items/stats` - Comprehensive statistics
- `POST /api/v1/items/{id}/reassign` - Item reassignment
- `GET /api/v1/items/states` - Nigerian states
- `GET /api/v1/items/lgas/{state}` - LGAs by state

### Batch Management
- `POST /api/v1/batches/upload` - CSV/Excel file upload
- `GET /api/v1/batches/{id}/items` - Batch items with filtering

### Delivery & Riders
- `POST /api/v1/deliveries/bulk-assign` - Bulk assignment
- `GET /api/v1/riders/{id}/performance` - Performance metrics
- `GET /api/v1/hubs/{id}/capacity` - Hub capacity

### Monitoring
- **Prometheus**: http://localhost:9090
- **Grafana**: http://localhost:3000
- **Kafka UI**: http://localhost:8080

## User Roles
- **Super Admin**: Full system access
- **Client Admin**: Batch and item management
- **Operations Manager**: Dispatch and analytics
- **Rider**: Delivery management
- **Applicant**: Item tracking

## Documentation
- **Enhanced API**: [backend/API_ENDPOINTS_ENHANCED.md](backend/API_ENDPOINTS_ENHANCED.md)
- **Frontend Mapping**: [backend/FRONTEND_API_MAPPING_ENHANCED.md](backend/FRONTEND_API_MAPPING_ENHANCED.md)
- **Infrastructure**: [infrastructure/README.md](infrastructure/README.md)

## Deployment

### Development
```bash
docker-compose up -d
```

### Production (Azure)
```bash
cd infrastructure
./deploy.ps1  # Windows
./deploy.sh   # Linux/macOS
```

This enhanced version provides production-ready logistics management with modern UX patterns, comprehensive filtering, and full monitoring capabilities.