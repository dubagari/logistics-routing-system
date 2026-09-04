import { logout } from "@/store/slices/authSlice";
import { store } from "@/store/store";

const API_URL = "http://10.47.51.176:5000/api";

export const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
) => {
  const url = `${API_URL}${endpoint}`;

  console.log("API REQUEST:", {
    method: options.method || "GET",
    url,
  });

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    });

    const contentType =
      response.headers.get("content-type") || "";

    console.log("API STATUS:", response.status);
    console.log("API CONTENT TYPE:", contentType);

    const text = await response.text();

    console.log("API RAW RESPONSE:", text);

    let data: any;

    if (contentType.includes("application/json")) {
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(
          "Server returned invalid JSON"
        );
      }
    } else {
      throw new Error(
        `Server returned non-JSON response (${response.status})`
      );
    }

    // Account was deactivated by admin
    if (
      response.status === 403 &&
      data?.message === "Your account is inactive"
    ) {
      store.dispatch(logout());
    }

    if (!response.ok) {
      const error: any = new Error(
        data?.message ||
          `Request failed with status ${response.status}`
      );

      error.status = response.status;
      error.data = data;

      throw error;
    }

    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};