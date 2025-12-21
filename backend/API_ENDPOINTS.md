# Backend API Endpoints - Complete Frontend Coverage

## User Service (Port: 5001)
### Authentication
- `POST /api/auth/login` - User login ✅
- `POST /api/auth/register` - User registration ✅
- `POST /api/auth/logout` - User logout ✅

### Users Management
- `GET /api/users` - Get paginated users list ✅
- `GET /api/users/{id}` - Get user by ID ✅
- `GET /api/users/me` - Get current user profile ✅

### Audit Logs
- `GET /api/audit/logs` - Get audit logs with pagination ✅

## Item Service (Port: 5002)
### Items Management
- `GET /api/items` - Get paginated items (with status/state filters) ✅
- `GET /api/items/{id}` - Get item by ID ✅
- `POST /api/items` - Create new item ✅
- `PUT /api/items/{id}/status` - Update item status ✅
- `POST /api/items/{id}/print-label` - Generate printable QR label ✅
- `GET /api/items/search?q={query}` - Global search across items ✅

### Batch Management
- `GET /api/batches` - Get paginated batches ✅
- `GET /api/batches/{id}` - Get batch by ID ✅
- `GET /api/batches/{id}/items` - Get items in specific batch ✅
- `POST /api/batches` - Create new batch with items ✅

### File Upload
- `POST /api/upload/batch` - Upload CSV/Excel batch file ✅

### Analytics
- `GET /api/analytics/dashboard` - Get dashboard statistics ✅
- `GET /api/analytics/delivery-performance` - Get delivery performance metrics ✅
- `GET /api/analytics/trends` - Get delivery trend data for charts ✅
- `GET /api/analytics/states` - Get state-wise distribution data ✅

### Tracking
- `GET /api/tracking/item/{itemNumber}` - Track item by number ✅
- `GET /api/tracking/qr/{qrCode}` - Track item by QR code ✅

## Delivery Service (Port: 5003)
### Deliveries Management
- `GET /api/deliveries` - Get deliveries (with riderId filter) ✅
- `POST /api/deliveries/assign` - Assign delivery to rider ✅
- `PUT /api/deliveries/{id}/pickup` - Mark delivery as picked up ✅
- `PUT /api/deliveries/{id}/deliver` - Mark delivery as delivered with proof ✅

### Riders Management
- `GET /api/riders` - Get riders (with region filter) ✅
- `GET /api/riders/available` - Get available riders ✅
- `GET /api/riders/{id}` - Get rider by ID ✅
- `POST /api/riders` - Create new rider ✅
- `PUT /api/riders/{id}/status` - Update rider status ✅

### Hubs Management
- `GET /api/hubs` - Get all hubs ✅
- `GET /api/hubs/{id}` - Get hub by ID ✅
- `POST /api/hubs` - Create new hub ✅

### Location Services
- `POST /api/location/capture` - Capture GPS location ✅
- `GET /api/location/current` - Get current location ✅

## Notification Service (Port: 5004)
### Notifications
- `POST /api/notifications/sms` - Send SMS notification ✅
- `POST /api/notifications/email` - Send email notification ✅
- `POST /api/notifications/push` - Send push notification ✅

### Support
- `POST /api/support/contact` - Send support request ✅
- `GET /api/support/info` - Get support contact information ✅

## API Gateway (Port: 5000)
- Routes all requests to appropriate microservices ✅
- Swagger documentation available at `/swagger` ✅

## ✅ COMPLETE FRONTEND COVERAGE ACHIEVED

### Frontend Component Mapping:
✅ **App.tsx** - User profile, logout, dashboard stats
✅ **Dashboard** - Statistics and recent items
✅ **ItemsTable** - Filtered items with search
✅ **BatchManagement** - Batch CRUD and file upload
✅ **RiderDashboard** - Rider profile, deliveries, GPS
✅ **ApplicantTracking** - Item tracking and support
✅ **AnalyticsDashboard** - Charts and performance data
✅ **DispatchManagement** - Hub/rider assignment
✅ **AuditLogs** - System activity logs
✅ **ItemDetailModal** - Item details and label printing

### All Features Supported:
- ✅ Authentication & Authorization
- ✅ User Profile Management
- ✅ Item CRUD with Status Updates
- ✅ Batch Upload & Management
- ✅ Real-time Delivery Tracking
- ✅ GPS Location Services
- ✅ Analytics & Reporting
- ✅ Dispatch Management
- ✅ Audit Logging
- ✅ Multi-channel Notifications
- ✅ Support System
- ✅ Label Printing
- ✅ Global Search

**Backend provides 100% API coverage for all frontend functionality.**