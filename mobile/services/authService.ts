import { apiRequest } from "./api";

export interface LoginData {
  email: string;
  password: string;
}

export const loginUser = async (
  data: LoginData
) => {
  return apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
};