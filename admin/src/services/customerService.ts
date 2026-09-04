const API_URL = import.meta.env.VITE_API_URL;

export const getAllCustomers = async (
  token: string
) => {
  const response = await fetch(
    `${API_URL}/api/auth/customers`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to fetch customers"
    );
  }

  return data;
};