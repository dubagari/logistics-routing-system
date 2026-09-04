export interface DeliveryStats {
  total: number;
  pending: number;
  assigned: number;
  accepted: number;
  in_transit: number;
  delivered: number;
  cancelled: number;
}

export interface DeliveryStatsResponse {
  success: boolean;
  stats: DeliveryStats;
}

const API_URL = import.meta.env.VITE_API_URL;

export const getDeliveryStats = async (
  token: string
): Promise<DeliveryStatsResponse> => {
  const response = await fetch(
    `${API_URL}/api/deliveries/admin/stats`,
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
      data.message || "Failed to fetch delivery statistics"
    );
  }

  return data;
};