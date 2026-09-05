import { apiRequest } from "./api";

export interface LoginData {
  email: string;
  password: string;
}


export interface RegisterData {
  name: string;
  email: string;
  phone: string;
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



export const registerUser = async (
  data: RegisterData
) => {
  return apiRequest("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
};