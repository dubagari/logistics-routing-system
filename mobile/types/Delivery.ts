export type DeliveryStatus =
  | "pending"
  | "in_transit"
  | "delivered"
  | "cancelled";

export interface Delivery {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  pickupLocation: string;
  deliveryLocation: string;
  status: DeliveryStatus;
  distance: number;
  estimatedTime: number;
}