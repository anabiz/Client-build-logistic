# Frontend-Backend API Mapping Analysis

## Frontend Components and Required APIs

### 1. App.tsx - Main Application
**Required APIs:**
- `GET /api/users/me` - Get current user info ❌ MISSING
- `POST /api/auth/logout` - User logout ❌ MISSING
- `GET /api/analytics/dashboard` - Dashboard stats ✅ EXISTS

### 2. Dashboard Component
**Required APIs:**
- `GET /api/analytics/dashboard` - Get statistics ✅ EXISTS
- `GET /api/items?limit=5` - Recent items ✅ EXISTS

### 3. ItemsTable Component
**Required APIs:**
- `GET /api/items?status={status}&state={state}&search={term}` - Filtered items ✅ EXISTS
- `GET /api/items/{id}` - Item details ✅ EXISTS

### 4. BatchManagement Component
**Required APIs:**
- `GET /api/batches` - List batches ✅ EXISTS
- `POST /api/upload/batch` - Upload CSV/Excel ✅ EXISTS
- `GET /api/batches/{id}/items` - Items in batch ❌ MISSING

### 5. RiderDashboard Component
**Required APIs:**
- `GET /api/riders/{id}` - Rider profile ✅ EXISTS
- `GET /api/deliveries?riderId={id}` - Assigned deliveries ✅ EXISTS
- `PUT /api/deliveries/{id}/pickup` - Mark picked up ✅ EXISTS
- `PUT /api/deliveries/{id}/deliver` - Mark delivered ✅ EXISTS
- `POST /api/location/capture` - GPS capture ✅ EXISTS

### 6. ApplicantTracking Component
**Required APIs:**
- `GET /api/tracking/item/{itemNumber}` - Track by number ✅ EXISTS
- `GET /api/tracking/qr/{qrCode}` - Track by QR ✅ EXISTS
- `GET /api/support/info` - Support contact ✅ EXISTS
- `POST /api/support/contact` - Contact support ✅ EXISTS

### 7. AnalyticsDashboard Component
**Required APIs:**
- `GET /api/analytics/dashboard` - Basic stats ✅ EXISTS
- `GET /api/analytics/trends` - Chart data ✅ EXISTS
- `GET /api/analytics/states` - State distribution ✅ EXISTS

### 8. DispatchManagement Component
**Required APIs:**
- `GET /api/hubs` - List hubs ✅ EXISTS
- `GET /api/riders?status=available` - Available riders ✅ EXISTS
- `GET /api/items?status=stored,received` - Pending items ✅ EXISTS
- `POST /api/deliveries/assign` - Assign delivery ✅ EXISTS

### 9. AuditLogs Component
**Required APIs:**
- `GET /api/audit/logs` - Audit logs ✅ EXISTS

### 10. ItemDetailModal Component
**Required APIs:**
- `GET /api/items/{id}` - Item details ✅ EXISTS
- `GET /api/riders/{id}` - Rider info ✅ EXISTS
- `POST /api/items/{id}/print-label` - Print QR label ❌ MISSING

## MISSING ENDPOINTS IDENTIFIED:

1. **User Profile Management**
   - `GET /api/users/me` - Current user profile
   - `POST /api/auth/logout` - User logout

2. **Batch Items**
   - `GET /api/batches/{id}/items` - Get items in specific batch

3. **Label Printing**
   - `POST /api/items/{id}/print-label` - Generate printable QR label

4. **Enhanced Search**
   - `GET /api/items/search?q={query}` - Global search across items

## PRIORITY MISSING ENDPOINTS TO ADD:
1. User profile endpoints (HIGH)
2. Batch items endpoint (MEDIUM)
3. Label printing endpoint (LOW)
4. Enhanced search (LOW)