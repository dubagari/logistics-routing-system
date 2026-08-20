

import { apiRequest } from "./api";
import { Delivery } from "../types/Delivery";

// ============================================
// RESPONSE TYPES
// ============================================

interface DriverDeliveriesResponse {
  success: boolean;
  count: number;
  deliveries: Delivery[];
}

interface DeliveryActionResponse {
  success: boolean;
  message: string;
  delivery: Delivery;
}

interface DeliveryLocation {
  latitude: number;
  longitude: number;
  updatedAt: string;
}

interface DeliveryLocationResponse {
  success: boolean;
  message: string;
  location: DeliveryLocation;
  routeStatus: any;
  routeRecalculated: boolean;
  distance: number;
  estimatedTime: number;
}

// ============================================
// GET DRIVER DELIVERIES
// ============================================

export const getDriverDeliveries = async (
  token: string
): Promise<DriverDeliveriesResponse> => {
  const response = await apiRequest("/deliveries/driver", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response;
};

// ============================================
// ACCEPT DELIVERY
// ============================================

export const acceptDelivery = async (
  id: string,
  token: string
): Promise<DeliveryActionResponse> => {
  const response = await apiRequest(`/deliveries/${id}/accept`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response;
};

// ============================================
// START DELIVERY
// ============================================

export const startDelivery = async (
  id: string,
  token: string
): Promise<DeliveryActionResponse> => {
  const response = await apiRequest(`/deliveries/${id}/start`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response;
};

// ============================================
// UPDATE DELIVERY LOCATION
// ============================================

export const updateDeliveryLocation = async (
  id: string,
  token: string,
  latitude: number,
  longitude: number
): Promise<DeliveryLocationResponse> => {
  const response = await apiRequest(`/deliveries/${id}/location`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      latitude,
      longitude,
    }),
  });

  return response;
};

// ============================================
// COMPLETE DELIVERY
// ============================================

export const completeDelivery = async (
  id: string,
  token: string
): Promise<DeliveryActionResponse> => {
  const response = await apiRequest(`/deliveries/${id}/complete`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response;
};