import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

import type {
    Delivery,
    DeliveryStatus,
} from "../../types/Delivery";

import {
  assignDriver,
  getAllDeliveries,
} from "../../services/deliveryService";

interface DeliveryState {
  deliveries: Delivery[];

  loading: boolean;

  error: string | null;
}

const initialState: DeliveryState = {
  deliveries: [],
  loading: false,
  error: null,
};

// ========================================
// Fetch All Deliveries
// ========================================

export const fetchAllDeliveries =  createAsyncThunk(
    "deliveries/fetchAll",
    async (
      {
        token,
        status,
      }: {
        token: string;
        status?: DeliveryStatus;
      },
      { rejectWithValue }
    ) => {
      try {
        const data =
          await getAllDeliveries(
            token,
            status
          );

        return data.deliveries;
      } catch (error) {
        return rejectWithValue(
          error instanceof Error
            ? error.message
            : "Failed to fetch deliveries"
        );
      }
    }
  );

// ========================================
// Assign Driver
// ========================================

export const assignDriverThunk = createAsyncThunk(
    "deliveries/assignDriver",
    async (
      {
        token,
        deliveryId,
        driverId,
      }: {
        token: string;
        deliveryId: string;
        driverId: string;
      },
      { rejectWithValue }
    ) => {
      try {
        const data =
          await assignDriver(
            token,
            deliveryId,
            driverId
          );

        return data.delivery;
      } catch (error) {
        return rejectWithValue(
          error instanceof Error
            ? error.message
            : "Failed to assign driver"
        );
      }
    }
  );

const deliverySlice = createSlice({
  name: "deliveries",

  initialState,

  reducers: {},

  extraReducers: (builder) => {
    builder

      // ========================================
      // Fetch Deliveries
      // ========================================

      .addCase(
        fetchAllDeliveries.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        fetchAllDeliveries.fulfilled,
        (state, action) => {
          state.loading = false;
          state.deliveries =
            action.payload;
        }
      )

      .addCase(
        fetchAllDeliveries.rejected,
        (state, action) => {
          state.loading = false;

          state.error =
            action.payload as string;
        }
      )


      // ========================================
// Assign Driver
// ========================================

.addCase(
  assignDriverThunk.fulfilled,
  (state, action) => {
    const index =
      state.deliveries.findIndex(
        (delivery) =>
          delivery._id === action.payload._id
      );

    if (index !== -1) {
      state.deliveries[index] =
        action.payload;
    }
  }
)

.addCase(
  assignDriverThunk.rejected,
  (state, action) => {
    state.error =
      action.payload as string;
  }
);
  },
});

export default deliverySlice.reducer;