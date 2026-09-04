import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

import { loginAdmin } from "../../services/authService";
import type { User } from "../../types/Auth";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const storedToken = localStorage.getItem("adminToken");
const storedUser = localStorage.getItem("adminUser");

const initialState: AuthState = {
  user: storedUser
    ? JSON.parse(storedUser)
    : null,

  token: storedToken,

  isAuthenticated:
    !!storedToken && !!storedUser,

  loading: false,
  error: null,
};

export const loginAdminThunk = createAsyncThunk(
  "auth/loginAdmin",
  async (
    {
      email,
      password,
    }: {
      email: string;
      password: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await loginAdmin(
        email,
        password
      );

      if (response.user.role !== "admin") {
        return rejectWithValue(
          "Only admin users can access this dashboard."
        );
      }

      // Save login session
      localStorage.setItem(
        "adminToken",
        response.token
      );

      localStorage.setItem(
        "adminUser",
        JSON.stringify(response.user)
      );

      return response;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Login failed"
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;

      // Remove saved session
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminUser");
    },

    clearAuthError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      .addCase(
        loginAdminThunk.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        loginAdminThunk.fulfilled,
        (state, action) => {
          state.loading = false;

          state.user =
            action.payload.user;

          state.token =
            action.payload.token;

          state.isAuthenticated = true;
        }
      )

      .addCase(
        loginAdminThunk.rejected,
        (state, action) => {
          state.loading = false;

          state.error =
            (action.payload as string) ||
            "Login failed";
        }
      );
  },
});

export const {
  logout,
  clearAuthError,
} = authSlice.actions;

export default authSlice.reducer;