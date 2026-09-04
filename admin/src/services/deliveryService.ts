const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

export const getAllDeliveries = async (
  token: string,
  status?: string
) => {
  let url = `${API_URL}/api/deliveries/admin`;

  if (status) {
    url += `?status=${status}`;
  }

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to fetch deliveries"
    );
  }

  return data;
};

export const assignDriver = async (
  token: string,
  deliveryId: string,
  driverId: string
) => {
  const response = await fetch(
    `${API_URL}/api/deliveries/${deliveryId}/assign`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        driverId,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to assign driver"
    );
  }

  return data;
};

export const getAdminDeliveryById = async (
  token: string,
  deliveryId: string
) => {
  const response = await fetch(
    `${API_URL}/api/deliveries/admin/${deliveryId}`,
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
      data.message ||
        "Failed to fetch delivery details"
    );
  }

  return data;
};