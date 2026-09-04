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

export interface CreateDeliveryData {
  pickupLocation: {
    address: string;
    latitude: number;
    longitude: number;
  };

  deliveryLocation: {
    address: string;
    latitude: number;
    longitude: number;
  };

  packageDescription: string;
  packageWeight?: number;
  notes?: string;
}

// ============================================
// GET DRIVER DELIVERIES
// ============================================

export const getDriverDeliveries = async (
  token: string
): Promise<DriverDeliveriesResponse> => {
  const response = await apiRequest(
    "/deliveries/driver",
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response;
};

// ============================================
// ACCEPT DELIVERY
// ============================================

export const acceptDelivery = async (
  id: string,
  token: string
): Promise<DeliveryActionResponse> => {
  const response = await apiRequest(
    `/deliveries/${id}/accept`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response;
};

// ============================================
// START DELIVERY
// ============================================

export const startDelivery = async (
  id: string,
  token: string
): Promise<DeliveryActionResponse> => {
  const response = await apiRequest(
    `/deliveries/${id}/start`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response;
};



export const selectDeliveryRoute = async (
  id: string,
  token: string,
  routeId: string
): Promise<DeliveryActionResponse> => {
  const response = await apiRequest(
  `/deliveries/${id}/route`,
    {
      method: "PUT",

      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        routeId,
      }),
    }
  );

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
  const response = await apiRequest(
    `/deliveries/${id}/location`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        latitude,
        longitude,
      }),
    }
  );

  return response;
};

// ============================================
// COMPLETE DELIVERY
// ============================================

export const completeDelivery = async (
  id: string,
  token: string
): Promise<DeliveryActionResponse> => {
  const response = await apiRequest(
    `/deliveries/${id}/complete`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response;
};

// ============================================
// CREATE DELIVERY
// ============================================

export const createCustomerDelivery = async (
  data: CreateDeliveryData,
  token: string
): Promise<DeliveryActionResponse> => {
  const response = await apiRequest(
    "/deliveries",
    {
      method: "POST",

      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },

      body: JSON.stringify(data),
    }
  );

  return response;
};

// ============================================
// GET CUSTOMER DELIVERIES
// ============================================

export const getCustomerDeliveries = async (
  token: string
): Promise<DriverDeliveriesResponse> => {
  const response = await apiRequest(
    "/deliveries/customer",
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response;
};



// ============================================
// GET CUSTOMER DELIVERY BY ID
// ============================================

export const getCustomerDeliveryById = async (
  id: string,
  token: string
): Promise<DeliveryActionResponse> => {
  const response = await apiRequest(
    `/deliveries/${id}`,
    {
      method: "GET",

      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response;
};


// ============================================
// TRACK CUSTOMER DELIVERY
// ============================================

export const trackCustomerDelivery = async (
  id: string,
  token: string
) => {
  const response = await apiRequest(
    `/deliveries/${id}/track`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response;
};


