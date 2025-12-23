# API Endpoints Documentation - Enhanced Version

## Base URLs
- **Development**: http://localhost:5000
- **Production**: https://your-domain.com

## Authentication
All endpoints require JWT Bearer token except public endpoints.

```
Authorization: Bearer <token>
```

## Response Format
All endpoints return standardized responses:

```json
{
  "success": true,
  "data": {},
  "message": "Success message",
  "errors": null
}
```

## Pagination & Filtering
Enhanced pagination with comprehensive filtering:

### Query Parameters
- `page` (int): Page number (default: 1)
- `pageSize` (int): Items per page (5, 10, 25, 50, 100)
- `search` (string): Multi-field search term
- `sortBy` (string): Field to sort by
- `sortOrder` (string): "asc" or "desc"

### Item-Specific Filters
- `status`: received, stored, dispatched, in-transit, delivered, failed
- `state`: Nigerian state filter
- `lga`: Local Government Area filter
- `batchId`: Filter by batch
- `riderId`: Filter by assigned rider
- `hubId`: Filter by hub
- `createdFrom/createdTo`: Date range filters

## User Service Endpoints (Port: 5001)

### Authentication
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/refresh` - Refresh token
- `POST /api/v1/auth/logout` - User logout

### Users Management
- `GET /api/v1/users` - Get paginated users
  - Query: `role`, `region`, `search`, pagination
- `GET /api/v1/users/{id}` - Get user by ID
- `POST /api/v1/users` - Create user
- `PUT /api/v1/users/{id}` - Update user
- `PUT /api/v1/users/{id}/role` - Update user role
- `PUT /api/v1/users/{id}/password` - Change password

### Audit Logs (Super Admin Only)
- `GET /api/v1/auditlogs` - Get paginated audit logs
  - Query: `userId`, `action`, `itemId`, `from`, `to`, pagination
- `GET /api/v1/auditlogs/actions` - Get available actions
- `GET /api/v1/auditlogs/users/{userId}` - Get user audit logs
- `GET /api/v1/auditlogs/items/{itemId}` - Get item audit logs
- `GET /api/v1/auditlogs/export` - Export audit logs to CSV

## Item Service Endpoints (Port: 5002)

### Items Management
- `GET /api/v1/items` - Get paginated items with advanced filtering
  - Query: All item filters + pagination + search
- `GET /api/v1/items/{id}` - Get item by ID
- `POST /api/v1/items` - Create item
- `PUT /api/v1/items/{id}` - Update item
- `PATCH /api/v1/items/{id}/status` - Update item status only
- `POST /api/v1/items/{id}/reassign` - Reassign item to different rider
- `POST /api/v1/items/{id}/print-label` - Generate printable QR label

### Item Analytics & Utilities
- `GET /api/v1/items/stats` - Comprehensive item statistics
  - Query: `from`, `to`, `state`, `riderId`, `hubId`
  - Returns: Total, delivered, in-transit, pending, failed counts + rates
- `GET /api/v1/items/states` - Get all Nigerian states
- `GET /api/v1/items/lgas/{state}` - Get LGAs for specific state

### Batch Management
- `GET /api/v1/batches` - Get paginated batches
  - Query: `status`, `clientId`, `uploadedFrom`, `uploadedTo`, pagination
- `GET /api/v1/batches/{id}` - Get batch by ID
- `POST /api/v1/batches` - Create batch manually
- `POST /api/v1/batches/upload` - Upload batch from CSV/Excel file
  - Supports: CSV, XLSX files up to 10MB, 10,000 rows
- `PUT /api/v1/batches/{id}/status` - Update batch status
- `GET /api/v1/batches/{id}/items` - Get items in specific batch

## Delivery Service Endpoints (Port: 5003)

### Deliveries Management
- `GET /api/v1/deliveries` - Get paginated deliveries
  - Query: `riderId`, `status`, `state`, `assignedFrom`, `assignedTo`, pagination
- `GET /api/v1/deliveries/{id}` - Get delivery by ID
- `POST /api/v1/deliveries/assign` - Assign single delivery
- `POST /api/v1/deliveries/bulk-assign` - Bulk assign multiple deliveries
- `PUT /api/v1/deliveries/{id}/pickup` - Mark delivery picked up
- `PUT /api/v1/deliveries/{id}/deliver` - Mark delivery completed with proof
- `PUT /api/v1/deliveries/{id}/fail` - Mark delivery failed with reason
- `GET /api/v1/deliveries/stats` - Get delivery performance statistics

### Riders Management
- `GET /api/v1/riders` - Get paginated riders
  - Query: `status`, `region`, `minRating`, `maxRating`, pagination
- `GET /api/v1/riders/{id}` - Get rider by ID
- `POST /api/v1/riders` - Create new rider
- `PUT /api/v1/riders/{id}` - Update rider information
- `PUT /api/v1/riders/{id}/status` - Update rider status (active/inactive)
- `GET /api/v1/riders/{id}/performance` - Get detailed rider performance metrics
- `GET /api/v1/riders/{id}/deliveries` - Get rider's delivery history
- `GET /api/v1/riders/available` - Get available riders by region

### Hubs Management
- `GET /api/v1/hubs` - Get paginated hubs
  - Query: `state`, `manager`, pagination
- `GET /api/v1/hubs/{id}` - Get hub by ID
- `POST /api/v1/hubs` - Create new hub
- `PUT /api/v1/hubs/{id}` - Update hub information
- `GET /api/v1/hubs/{id}/capacity` - Get hub capacity and current load
- `GET /api/v1/hubs/{id}/items` - Get items currently at hub
- `GET /api/v1/hubs/by-state/{state}` - Get all hubs in specific state

## Notification Service Endpoints (Port: 5004)

### Multi-Channel Notifications
- `POST /api/v1/notifications/sms` - Send SMS via Termii (Nigeria-optimized)
- `POST /api/v1/notifications/email` - Send email via MailKit
- `POST /api/v1/notifications/push` - Send push notification via Firebase
- `GET /api/v1/notifications/templates` - Get notification templates

### Kafka Monitoring
- `GET /api/v1/kafkamonitor/topics` - Get Kafka topics list
- `GET /api/v1/kafkamonitor/consumer-groups` - Get Kafka consumer groups

## Enhanced Features

### Advanced Search
- **Multi-field search**: Item number, applicant name, QR code, phone
- **Fuzzy matching**: Tolerates typos and partial matches
- **Real-time suggestions**: As-you-type search results

### Smart Filtering
- **Cascading filters**: State → LGA → Hub relationships
- **Date range pickers**: Custom date ranges with presets
- **Status combinations**: Multiple status selections
- **Performance filters**: Rating ranges, delivery success rates

### Pagination Enhancements
- **Flexible page sizes**: 5, 10, 25, 50, 100 items per page
- **Smart navigation**: Jump to first/last page, ellipsis for large datasets
- **Result summaries**: "Showing X to Y of Z results"
- **Mobile-optimized**: Simplified controls for mobile devices

### Export Capabilities
- **CSV exports**: Filtered data with custom columns
- **PDF reports**: Formatted reports with charts
- **Excel exports**: Multi-sheet workbooks with pivot tables

### Real-Time Features
- **Live status updates**: WebSocket connections for real-time updates
- **Push notifications**: Instant delivery status changes
- **Live tracking**: GPS-based real-time location tracking

## Mobile API Optimizations

### Responsive Data
- **Card view data**: Optimized JSON for mobile card layouts
- **Reduced payloads**: Essential fields only for mobile
- **Image optimization**: Multiple sizes for different screen densities

### Offline Support
- **Cached responses**: Critical data cached for offline access
- **Sync queues**: Actions queued when offline, synced when online
- **Progressive loading**: Essential data first, details on demand

## Performance Features

### Caching Strategy
- **Redis caching**: Frequently accessed data cached
- **CDN integration**: Static assets served via CDN
- **Browser caching**: Appropriate cache headers for client-side caching

### Rate Limiting
- **General API**: 1000 requests/hour per IP
- **Authentication**: 10 requests/minute per IP
- **File uploads**: 5 requests/minute per user
- **Search**: 100 requests/minute per user

### Monitoring & Analytics
- **Prometheus metrics**: Performance and usage metrics
- **Grafana dashboards**: Real-time monitoring dashboards
- **Error tracking**: Comprehensive error logging and alerting

## Security Enhancements

### Authentication & Authorization
- **JWT tokens**: Secure token-based authentication
- **Role-based access**: Granular permissions per user role
- **Session management**: Secure session handling with refresh tokens

### Data Protection
- **Input validation**: Comprehensive request validation
- **SQL injection protection**: Parameterized queries
- **XSS prevention**: Output encoding and CSP headers
- **Rate limiting**: DDoS protection and abuse prevention

## Nigerian Market Optimizations

### SMS Integration
- **Termii API**: Optimized for Nigerian mobile networks
- **Multiple providers**: Fallback SMS providers for reliability
- **Cost optimization**: Smart routing for cost-effective delivery

### Geographic Data
- **Nigerian states**: Complete list of 36 states + FCT
- **LGA database**: All 774 Local Government Areas
- **Postal codes**: Nigerian postal code integration
- **Address validation**: Nigerian address format validation

### Payment Integration (Future)
- **Paystack**: Nigerian payment gateway integration
- **Flutterwave**: Alternative payment processing
- **Bank transfers**: Direct bank account integration
- **Mobile money**: MTN, Airtel mobile money support

This enhanced API documentation reflects all the new pagination, filtering, search, and mobile optimization features implemented in the frontend.