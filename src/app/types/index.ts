export type UserRole = "super-admin" | "client-admin" | "operations-manager" | "rider" | "applicant";

export type ItemStatus = "received" | "stored" | "dispatched" | "in-transit" | "delivered" | "failed";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  region?: string;
}

export interface Item {
  id: string;
  batchId: string;
  itemNumber: string;
  qrCode: string;
  applicantName: string;
  applicantPhone: string;
  applicantEmail: string;
  deliveryAddress: string;
  state: string;
  lga: string;
  status: ItemStatus;
  createdAt: string;
  dispatchedAt?: string;
  deliveredAt?: string;
  riderId?: string;
  hubId?: string;
  estimatedDelivery?: string;
}

export interface Batch {
  id: string;
  batchNumber: string;
  clientId: string;
  totalItems: number;
  uploadedAt: string;
  uploadedBy: string;
  status: "processing" | "ready" | "dispatched" | "completed";
  description: string;
}

export interface Rider {
  id: string;
  name: string;
  phone: string;
  email: string;
  vehicleNumber: string;
  region: string;
  status: "available" | "on-delivery" | "offline";
  rating: number;
  totalDeliveries: number;
  successRate: number;
}

export interface Hub {
  id: string;
  name: string;
  state: string;
  address: string;
  manager: string;
  capacity: number;
  currentLoad: number;
}

export interface Delivery {
  id: string;
  itemId: string;
  riderId: string;
  status: ItemStatus;
  assignedAt: string;
  pickedUpAt?: string;
  deliveredAt?: string;
  proofOfDelivery?: {
    signature?: string;
    photo?: string;
    gpsLocation: string;
    timestamp: string;
    recipientName: string;
  };
  failureReason?: string;
  reassignmentHistory?: ReassignmentRecord[];
}

export interface ReassignmentRecord {
  id: string;
  timestamp: string;
  fromRiderId: string;
  fromRiderName: string;
  toRiderId: string;
  toRiderName: string;
  reason: string;
  reasonCategory: "rider-unavailable" | "vehicle-breakdown" | "recipient-relocated" | "performance-issue" | "address-correction" | "other";
  reassignedBy: string;
  reassignedByName: string;
  notes?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: string;
  itemId?: string;
  details: string;
  ipAddress?: string;
}

export interface Analytics {
  totalItems: number;
  delivered: number;
  inTransit: number;
  pending: number;
  failed: number;
  deliveryRate: number;
  averageDeliveryTime: number;
}