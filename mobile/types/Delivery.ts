// ============================================
// DELIVERY STATUS
// ============================================

export type DeliveryStatus =
  | "pending"
  | "assigned"
  | "accepted"
  | "in_transit"
  | "delivered"
  | "cancelled";

// ============================================
// LOCATION
// ============================================

export interface Location {
  address: string;
  latitude: number;
  longitude: number;
}

// ============================================
// CURRENT LOCATION
// ============================================

export interface CurrentLocation {
  latitude: number | null;
  longitude: number | null;
  updatedAt: string | null;
}

// ============================================
// ROUTE GEOMETRY
// ============================================

export interface RouteGeometry {
  type: "LineString";
  coordinates: number[][];
}

// ============================================
// DELIVERY ROUTE
// ============================================

export interface DeliveryRoute {
  id: string;
  distance: number;
  estimatedTime: number;
  geometry: RouteGeometry;
}

// ============================================
// CUSTOMER
// ============================================

export interface Customer {
  _id: string;
  fullName?: string;
  email?: string;
  phone?: string;
}

// ============================================
// DRIVER
// ============================================

export interface Driver {
  _id: string;
  fullName?: string;
  email?: string;
  phone?: string;
}

// ============================================
// DELIVERY
// ============================================

export interface Delivery {
  _id: string;

  customer: Customer | string;

  driver: Driver | string | null;

  // Locations
  pickupLocation: Location;
  deliveryLocation: Location;

  // Driver location
  currentLocation: CurrentLocation;

  // Package
  packageDescription: string;
  packageWeight: number;
  notes: string;

  // ==========================================
  // CALCULATED ROUTES
  // ==========================================

  routes: DeliveryRoute[];

  // ==========================================
  // SELECTED ROUTE
  // ==========================================

  selectedRoute: string | null;

  selectedRouteAt: string | null;

  // ==========================================
  // SELECTED ROUTE INFORMATION
  // ==========================================

  distance: number;
  estimatedTime: number;

  // ==========================================
  // STATUS
  // ==========================================

  status: DeliveryStatus;

  // ==========================================
  // TIMELINE
  // ==========================================

  assignedAt: string | null;
  acceptedAt: string | null;
  startedAt: string | null;
  deliveredAt: string | null;
  cancelledAt: string | null;

  // ==========================================
  // TIMESTAMPS
  // ==========================================

  createdAt: string;
  updatedAt: string;
}