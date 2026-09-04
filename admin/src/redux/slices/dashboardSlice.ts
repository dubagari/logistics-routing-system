import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

import { getDeliveryStats } from "../../services/dashboardService";
import type { DeliveryStats } from "../../services/dashboardService";

interface DashboardState {
  stats: DeliveryStats | null;
  loading: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  stats: null,
  loading: false,
  error: null,
};

export const fetchDashboardStats = createAsyncThunk(
  "dashboard/fetchStats",
  async (
    token: string,
    { rejectWithValue }
  ) => {
    try {
      const response =
        await getDeliveryStats(token);

      return response.stats;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Failed to fetch dashboard statistics"
      );
    }
  }
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,

  reducers: {
    clearDashboardError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(
        fetchDashboardStats.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        fetchDashboardStats.fulfilled,
        (state, action) => {
          state.loading = false;
          state.stats = action.payload;
        }
      )

      .addCase(
        fetchDashboardStats.rejected,
        (state, action) => {
          state.loading = false;
          state.error =
            (action.payload as string) ||
            "Failed to fetch dashboard statistics";
        }
      );
  },
});

export const {
  clearDashboardError,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;