import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

import { getAllCustomers } from "../../services/customerService";
import type { User } from "../../types/Auth";

interface CustomerState {
  customers: User[];
  loading: boolean;
  error: string | null;
}

const initialState: CustomerState = {
  customers: [],
  loading: false,
  error: null,
};

export const fetchAllCustomers = createAsyncThunk(
  "customers/fetchAll",
  async (
    token: string,
    { rejectWithValue }
  ) => {
    try {
      const response =
        await getAllCustomers(token);

      return response.customers;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Failed to fetch customers"
      );
    }
  }
);

const customerSlice = createSlice({
  name: "customers",

  initialState,

  reducers: {
    clearCustomerError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(
        fetchAllCustomers.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        fetchAllCustomers.fulfilled,
        (state, action) => {
          state.loading = false;
          state.customers = action.payload;
        }
      )

      .addCase(
        fetchAllCustomers.rejected,
        (state, action) => {
          state.loading = false;
          state.error =
            (action.payload as string) ||
            "Failed to fetch customers";
        }
      );
  },
});

export const {
  clearCustomerError,
} = customerSlice.actions;

export default customerSlice.reducer;