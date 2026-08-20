
import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
} from "@reduxjs/toolkit";

import {
  Delivery,
  DeliveryStatus,
} from "../../types/Delivery";

import {
  getDriverDeliveries,
  acceptDelivery,
  startDelivery,
  updateDeliveryLocation,
  completeDelivery,
} from "../../services/deliveryService";

// ============================================
// STATE
// ============================================

interface DeliveryState {
  deliveries: Delivery[];

  loading: boolean;
  error: string | null;

  accepting: boolean;
  starting: boolean;
  completing: boolean;
  updatingLocation: boolean;
}

const initialState: DeliveryState = {
  deliveries: [],

  loading: false,
  error: null,

  accepting: false,
  starting: false,
  completing: false,
  updatingLocation: false,
};

// ============================================
// GET DRIVER DELIVERIES
// ============================================

export const fetchDriverDeliveries =
  createAsyncThunk<
    Delivery[],
    string,
    { rejectValue: string }
  >(
    "deliveries/fetchDriverDeliveries",
    async (token, { rejectWithValue }) => {
      try {
        const response =
          await getDriverDeliveries(token);

        console.log(
          "DRIVER DELIVERIES:",
          response.deliveries
        );

        return response.deliveries;
      } catch (error: any) {
        return rejectWithValue(
          error.message ||
            "Failed to fetch deliveries"
        );
      }
    }
  );

// ============================================
// ACCEPT DELIVERY
// ============================================

export const acceptDriverDelivery =
  createAsyncThunk<
    Delivery,
    {
      id: string;
      token: string;
    },
    { rejectValue: string }
  >(
    "deliveries/acceptDriverDelivery",
    async (
      { id, token },
      { rejectWithValue }
    ) => {
      try {
        const response =
          await acceptDelivery(
            id,
            token
          );

        return response.delivery;
      } catch (error: any) {
        return rejectWithValue(
          error.message ||
            "Failed to accept delivery"
        );
      }
    }
  );

// ============================================
// START DELIVERY
// ============================================

export const startDriverDelivery =
  createAsyncThunk<
    Delivery,
    {
      id: string;
      token: string;
    },
    { rejectValue: string }
  >(
    "deliveries/startDriverDelivery",
    async (
      { id, token },
      { rejectWithValue }
    ) => {
      try {
        const response =
          await startDelivery(
            id,
            token
          );

        return response.delivery;
      } catch (error: any) {
        return rejectWithValue(
          error.message ||
            "Failed to start delivery"
        );
      }
    }
  );

// ============================================
// UPDATE DELIVERY LOCATION
// ============================================

export const updateDriverDeliveryLocation =
  createAsyncThunk<
    {
      id: string;
      latitude: number;
      longitude: number;
      updatedAt: string;
      distance: number;
      estimatedTime: number;
      routeRecalculated: boolean;
    },
    {
      id: string;
      token: string;
      latitude: number;
      longitude: number;
    },
    { rejectValue: string }
  >(
    "deliveries/updateDriverDeliveryLocation",
    async (
      {
        id,
        token,
        latitude,
        longitude,
      },
      { rejectWithValue }
    ) => {
      try {
        const response =
          await updateDeliveryLocation(
            id,
            token,
            latitude,
            longitude
          );

        return {
          id,

          latitude:
            response.location.latitude,

          longitude:
            response.location.longitude,

          updatedAt:
            response.location.updatedAt,

          distance:
            response.distance,

          estimatedTime:
            response.estimatedTime,

          routeRecalculated:
            response.routeRecalculated,
        };
      } catch (error: any) {
        return rejectWithValue(
          error.message ||
            "Failed to update delivery location"
        );
      }
    }
  );

// ============================================
// COMPLETE DELIVERY
// ============================================

export const completeDriverDelivery =
  createAsyncThunk<
    Delivery,
    {
      id: string;
      token: string;
    },
    { rejectValue: string }
  >(
    "deliveries/completeDriverDelivery",
    async (
      { id, token },
      { rejectWithValue }
    ) => {
      try {
        const response =
          await completeDelivery(
            id,
            token
          );

        return response.delivery;
      } catch (error: any) {
        return rejectWithValue(
          error.message ||
            "Failed to complete delivery"
        );
      }
    }
  );

// ============================================
// SLICE
// ============================================

const deliverySlice = createSlice({
  name: "deliveries",

  initialState,

  reducers: {
    updateDeliveryStatus: (
      state,
      action: PayloadAction<{
        id: string;
        status: DeliveryStatus;
      }>
    ) => {
      const delivery =
        state.deliveries.find(
          (item) =>
            item._id ===
            action.payload.id
        );

      if (delivery) {
        delivery.status =
          action.payload.status;
      }
    },

    clearDeliveryError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    // ========================================
    // FETCH
    // ========================================

    builder

      .addCase(
        fetchDriverDeliveries.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        fetchDriverDeliveries.fulfilled,
        (state, action) => {
          state.loading = false;
          state.deliveries =
            action.payload;
        }
      )

      .addCase(
        fetchDriverDeliveries.rejected,
        (state, action) => {
          state.loading = false;

          state.error =
            action.payload ||
            "Failed to fetch deliveries";
        }
      );

    // ========================================
    // ACCEPT
    // ========================================

    builder

      .addCase(
        acceptDriverDelivery.pending,
        (state) => {
          state.accepting = true;
          state.error = null;
        }
      )

      .addCase(
        acceptDriverDelivery.fulfilled,
        (state, action) => {
          state.accepting = false;

          const index =
            state.deliveries.findIndex(
              (delivery) =>
                delivery._id ===
                action.payload._id
            );

          if (index !== -1) {
            state.deliveries[index] =
              action.payload;
          }
        }
      )

      .addCase(
        acceptDriverDelivery.rejected,
        (state, action) => {
          state.accepting = false;

          state.error =
            action.payload ||
            "Failed to accept delivery";
        }
      );

    // ========================================
    // START
    // ========================================

    builder

      .addCase(
        startDriverDelivery.pending,
        (state) => {
          state.starting = true;
          state.error = null;
        }
      )

      .addCase(
        startDriverDelivery.fulfilled,
        (state, action) => {
          state.starting = false;

          const index =
            state.deliveries.findIndex(
              (delivery) =>
                delivery._id ===
                action.payload._id
            );

          if (index !== -1) {
            state.deliveries[index] =
              action.payload;
          }
        }
      )

      .addCase(
        startDriverDelivery.rejected,
        (state, action) => {
          state.starting = false;

          state.error =
            action.payload ||
            "Failed to start delivery";
        }
      );

    // ========================================
    // LOCATION
    // ========================================

    builder

      .addCase(
        updateDriverDeliveryLocation.pending,
        (state) => {
          state.updatingLocation =
            true;
        }
      )

      .addCase(
        updateDriverDeliveryLocation.fulfilled,
        (state, action) => {
          state.updatingLocation =
            false;

          const delivery =
            state.deliveries.find(
              (item) =>
                item._id ===
                action.payload.id
            );

          if (delivery) {
            delivery.currentLocation = {
              latitude:
                action.payload.latitude,

              longitude:
                action.payload.longitude,

              updatedAt:
                action.payload.updatedAt,
            };

            delivery.distance =
              action.payload.distance;

            delivery.estimatedTime =
              action.payload.estimatedTime;
          }
        }
      )

      .addCase(
        updateDriverDeliveryLocation.rejected,
        (state, action) => {
          state.updatingLocation =
            false;

          state.error =
            action.payload ||
            "Failed to update location";
        }
      );

    // ========================================
    // COMPLETE
    // ========================================

    builder

      .addCase(
        completeDriverDelivery.pending,
        (state) => {
          state.completing = true;
          state.error = null;
        }
      )

      .addCase(
        completeDriverDelivery.fulfilled,
        (state, action) => {
          state.completing = false;

          const index =
            state.deliveries.findIndex(
              (delivery) =>
                delivery._id ===
                action.payload._id
            );

          if (index !== -1) {
            state.deliveries[index] =
              action.payload;
          }
        }
      )

      .addCase(
        completeDriverDelivery.rejected,
        (state, action) => {
          state.completing = false;

          state.error =
            action.payload ||
            "Failed to complete delivery";
        }
      );
  },
});

export const {
  updateDeliveryStatus,
  clearDeliveryError,
} = deliverySlice.actions;

export default deliverySlice.reducer;