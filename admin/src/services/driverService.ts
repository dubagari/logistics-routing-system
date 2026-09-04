import type { User } from "../types/Auth";

const API_URL = import.meta.env.VITE_API_URL;


export interface CreateDriverData {
  name: string;
  email: string;
  phone: string;
  password: string;
  licenseNumber: string;
  vehicleType: string;
  vehicleNumber: string;
  vehicleModel?: string;
}

export interface UpdateDriverData {
  name: string;
  email: string;
  phone: string;
  licenseNumber: string;
  vehicleType: string;
  vehicleNumber: string;
  vehicleModel?: string;
   isActive?: boolean;
}

export interface Driver {
  _id: string;
  user: User;

  licenseNumber: string;

  vehicleType: string;
  vehicleNumber: string;
  vehicleModel?: string;

  isAvailable: boolean;
  status: string;

  currentLocation?: {
    latitude: number | null;
    longitude: number | null;
    updatedAt?: string | null;
  };

  createdAt?: string;
  updatedAt?: string;
}
export interface DriversResponse {
  success: boolean;
  count: number;
  drivers: Driver[];
}

export const getAllDrivers = async (
  token: string
): Promise<DriversResponse> => {
  const response = await fetch(
    `${API_URL}/api/drivers/admin`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to fetch drivers"
    );
  }

  return data;
};




export const createDriver = async (
  token: string,
  driverData: CreateDriverData
) => {
  const response = await fetch(
    `${API_URL}/api/drivers/admin`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(driverData),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to create driver"
    );
  }

  return data;
};

export const updateDriver = async (
  token: string,
  driverId: string,
  driverData: UpdateDriverData
) => {
  const response = await fetch(
    `${API_URL}/api/drivers/admin/${driverId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(driverData),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to update driver"
    );
  }

  return data;
};