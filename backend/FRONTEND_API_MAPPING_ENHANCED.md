# Frontend API Mapping - Enhanced Version

## Overview
Comprehensive mapping of frontend components to backend API endpoints with enhanced pagination, filtering, and search capabilities.

## Authentication & User Management

### Login Component
- **Endpoint**: `POST /api/v1/auth/login`
- **Purpose**: User authentication with role-based access
- **Response**: JWT token + user profile + permissions

### Role Selector Component
- **Endpoint**: `GET /api/v1/users/current`
- **Purpose**: Get current user role and switch context
- **Roles**: super-admin, client-admin, operations-manager, rider, applicant

## Enhanced Dashboard Components

### StatCard Component
- **Items Stats**: `GET /api/v1/items/stats`
  - Parameters: `from`, `to`, `state`, `riderId`, `hubId`
  - Returns: Total, delivered, in-transit, pending, failed counts
- **Delivery Stats**: `GET /api/v1/deliveries/stats`
  - Parameters: Date ranges, rider filters, state filters
  - Returns: Performance metrics, success rates, trends

### Analytics Dashboard
- **Comprehensive Analytics**: `GET /api/v1/items/stats`
- **Performance Metrics**: `GET /api/v1/riders/{id}/performance`
- **Hub Analytics**: `GET /api/v1/hubs/{id}/capacity`
- **Trend Data**: Historical performance with charts

## Advanced Item Management

### ItemsTable Component (Enhanced)
- **Primary Endpoint**: `GET /api/v1/items`
- **Pagination**: 
  - `page` (1-∞), `pageSize` (5,10,25,50,100)
  - Smart pagination with ellipsis for large datasets
- **Multi-field Search**: 
  - `search` parameter searches: item number, applicant name, QR code, phone
  - Real-time search with debouncing (300ms)
- **Advanced Filters**:
  - `status`: received, stored, dispatched, in-transit, delivered, failed
  - `state`: All 36 Nigerian states + FCT
  - `lga`: 774 Local Government Areas (cascading from state)
  - `batchId`: Filter by specific batch
  - `riderId`: Filter by assigned rider
  - `hubId`: Filter by hub location
- **Date Range Filters**:
  - `createdFrom/createdTo`: Item creation date range
  - `deliveredFrom/deliveredTo`: Delivery date range
- **Sorting**: 
  - `sortBy`: Any field (createdAt, status, state, etc.)
  - `sortOrder`: asc/desc with visual indicators

### ItemDetailModal Component
- **Get Item**: `GET /api/v1/items/{id}`
- **Status Updates**: `PATCH /api/v1/items/{id}/status`
- **Reassignment**: `POST /api/v1/items/{id}/reassign`
  - Parameters: `newRiderId`, `reason`, `notes`
- **Label Generation**: `POST /api/v1/items/{id}/print-label`
  - Returns: Printable QR code data

### Geographic Data Integration
- **Get States**: `GET /api/v1/items/states`
  - Returns: All Nigerian states for dropdowns
- **Get LGAs**: `GET /api/v1/items/lgas/{state}`
  - Returns: LGAs for selected state (cascading dropdown)

## Enhanced Batch Management

### BatchManagement Component
- **Get Batches**: `GET /api/v1/batches`
  - **Pagination**: Full pagination support
  - **Search**: Batch number, description, uploaded by
  - **Filters**: 
    - `status`: processing, ready, dispatched, completed
    - `clientId`: Filter by client
    - `uploadedFrom/uploadedTo`: Upload date range

### File Upload Enhancement
- **CSV Upload**: `POST /api/v1/batches/upload`
  - Supports: CSV, XLSX files
  - Validation: 10MB max, 10,000 rows max
  - Progress tracking and error reporting
- **Manual Creation**: `POST /api/v1/batches`
- **Batch Items**: `GET /api/v1/batches/{id}/items`
  - Uses same ItemQuery parameters for consistency

## Advanced Delivery Management

### DispatchManagement Component
- **Get Deliveries**: `GET /api/v1/deliveries`
  - **Enhanced Filters**: 
    - `riderId`: Specific rider assignments
    - `status`: Delivery status progression
    - `state`: Geographic filtering
    - `assignedFrom/assignedTo`: Assignment date range
- **Assignment Operations**:
  - Single: `POST /api/v1/deliveries/assign`
  - Bulk: `POST /api/v1/deliveries/bulk-assign`
- **Available Riders**: `GET /api/v1/riders/available?region={region}`

### RiderDashboard Component
- **Rider Profile**: `GET /api/v1/riders/{id}`
- **Assigned Deliveries**: `GET /api/v1/riders/{id}/deliveries`
  - Filtered by rider automatically
- **Status Updates**:
  - Pickup: `PUT /api/v1/deliveries/{id}/pickup`
  - Delivery: `PUT /api/v1/deliveries/{id}/deliver`
  - Failure: `PUT /api/v1/deliveries/{id}/fail`

### RiderPerformance Component
- **Get Riders**: `GET /api/v1/riders`
  - **Performance Filters**:
    - `status`: active, inactive, suspended
    - `region`: Geographic assignment
    - `minRating/maxRating`: Performance range
- **Individual Performance**: `GET /api/v1/riders/{id}/performance`
  - Returns: Delivery count, success rate, average rating, trends

## Hub Management Integration

### Hub Components
- **Get Hubs**: `GET /api/v1/hubs`
  - **Filters**: `state`, `manager`, capacity ranges
- **Hub Operations**:
  - Create: `POST /api/v1/hubs`
  - Update: `PUT /api/v1/hubs/{id}`
  - Capacity: `GET /api/v1/hubs/{id}/capacity`
- **Hub Items**: `GET /api/v1/hubs/{id}/items`
- **Geographic**: `GET /api/v1/hubs/by-state/{state}`

## Audit & Compliance

### AuditLogs Component (Super Admin)
- **Get Audit Logs**: `GET /api/v1/auditlogs`
  - **Advanced Filtering**:
    - `userId`: Filter by user actions
    - `action`: Specific action types
    - `itemId`: Item-specific audit trail
    - `from/to`: Date range for compliance
- **Export Capability**: `GET /api/v1/auditlogs/export`
  - Returns: CSV file for compliance reporting
- **Action Types**: `GET /api/v1/auditlogs/actions`

### ApplicantTracking Component
- **Track Items**: `GET /api/v1/items?applicantEmail={email}`
- **Status History**: Item audit trail for transparency

## Pagination Implementation Details

### usePagination Hook
```typescript
interface PaginationResult {
  paginatedData: T[];
  currentPage: number;
  totalPages: number;
  goToPage: (page: number) => void;
  startIndex: number;
  endIndex: number;
  totalItems: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}
```

### PaginationControls Component
- **Navigation**: First, Previous, Page Numbers, Next, Last
- **Page Size Selection**: 5, 10, 25, 50, 100 options
- **Smart Display**: Ellipsis for large page counts
- **Mobile Optimization**: Simplified controls for touch devices
- **Result Summary**: "Showing X to Y of Z results"

## Search & Filter Implementation

### Multi-Field Search
```typescript
const searchFields = [
  'itemNumber',
  'applicantName', 
  'applicantPhone',
  'qrCode',
  'deliveryAddress'
];
```

### Filter Components
- **Status Filter**: Multi-select dropdown with status badges
- **Geographic Filter**: Cascading State → LGA selection
- **Date Range**: Calendar pickers with presets (Today, Week, Month)
- **Performance Filter**: Slider ranges for ratings

### Real-Time Filtering
- **Debounced Search**: 300ms delay to prevent excessive API calls
- **Filter Persistence**: URL parameters maintain filter state
- **Clear Filters**: One-click filter reset functionality

## Mobile Responsiveness

### Responsive Design Patterns
- **Card View**: Alternative layout for mobile devices
- **Collapsible Filters**: Drawer-style filter panels
- **Touch Optimization**: Larger touch targets, swipe gestures
- **Progressive Disclosure**: Essential info first, details on tap

### Mobile-Specific Endpoints
- **Reduced Payloads**: Essential fields only for mobile
- **Image Optimization**: Multiple sizes for different densities
- **Offline Caching**: Critical data cached for offline access

## Performance Optimizations

### Client-Side Caching
```typescript
const cacheStrategy = {
  staticData: '1 hour',    // States, LGAs, statuses
  userData: '15 minutes',  // Current user info
  searchResults: '5 minutes', // Recent search results
  itemDetails: '2 minutes'    // Individual item data
};
```

### API Optimization
- **Field Selection**: Only request needed fields
- **Batch Requests**: Combine related API calls
- **Compression**: Gzip responses for large datasets
- **CDN Integration**: Static assets served via CDN

## Error Handling & UX

### Error States
- **Network Errors**: Retry mechanisms with exponential backoff
- **Validation Errors**: Field-specific error highlighting
- **Not Found**: Graceful 404 handling with suggestions
- **Rate Limiting**: User-friendly rate limit messages

### Loading States
- **Skeleton Screens**: Content placeholders during loading
- **Progressive Loading**: Essential data first, details follow
- **Infinite Scroll**: Seamless pagination for large datasets

## Future Enhancements

### Real-Time Features
- **WebSocket Integration**: Live status updates
- **Push Notifications**: Instant delivery alerts
- **Live Tracking**: GPS-based real-time location

### Advanced Analytics
- **Predictive Analytics**: Delivery time predictions
- **Route Optimization**: AI-powered route suggestions
- **Performance Insights**: Advanced rider analytics

This enhanced mapping ensures complete frontend-backend integration with all modern UX patterns and performance optimizations.