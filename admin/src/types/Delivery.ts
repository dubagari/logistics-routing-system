
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

export interface DeliveryUser {
  _id: string;
  name: string;
  email: string;
  phone?: string;
}



export interface DeliveriesResponse {
  success: boolean;
  count: number;
  deliveries: Delivery[];
}

export interface CurrentLocation {
  latitude: number | null;
  longitude: number | null;
  updatedAt?: string | null;
}

export interface RouteGeometry {
  type: "LineString";
  coordinates: [number, number][];
}

export interface DeliveryRoute {
  id: string;
  distance: number;
  estimatedTime: number;
  geometry: RouteGeometry;
}

export interface Delivery {
  _id: string;

  customer: DeliveryUser;

  driver?: DeliveryUser | null;

  pickupLocation: Location;

  deliveryLocation: Location;

  status: DeliveryStatus;

  distance?: number;

  estimatedTime?: number;

  createdAt: string;

  updatedAt: string;

  currentLocation?: CurrentLocation | null;
routes?: DeliveryRoute[];
selectedRoute?: string | null;
}