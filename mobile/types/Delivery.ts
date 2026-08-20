export type DeliveryStatus =
  | "pending"
  | "assigned"
  | "accepted"
  | "in_transit"
  | "delivered"
  | "cancelled";

export interface Location {
  address: string;
  latitude: number;
  longitude: number;
}

export interface CurrentLocation {
  latitude: number | null;
  longitude: number | null;
  updatedAt: string | null;
}

export interface RouteGeometry {
  type: "LineString";
  coordinates: number[][];
}

export interface Customer {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: "customer";
  isActive: boolean;
}

export interface Driver {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: "driver";
  isActive: boolean;
}

export interface Delivery {
  _id: string;

  customer: Customer;

  driver: Driver | null;

  pickupLocation: Location;

  deliveryLocation: Location;

  currentLocation: CurrentLocation;

  routeGeometry: RouteGeometry;

  packageDescription: string;

  packageWeight: number;

  notes: string;

  distance: number;

  estimatedTime: number;

  status: DeliveryStatus;

  assignedAt: string | null;

  acceptedAt: string | null;

  startedAt: string | null;

  deliveredAt: string | null;

  cancelledAt: string | null;

  createdAt: string;

  updatedAt: string;
}