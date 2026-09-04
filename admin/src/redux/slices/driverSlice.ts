import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";


import {
  getAllDrivers,
  createDriver,
  updateDriver,
  type Driver,
  type CreateDriverData,
  type UpdateDriverData,
} from "../../services/driverService";

interface DriverState {
  drivers: Driver[];
  loading: boolean;
  error: string | null;
}



const initialState: DriverState = {
  drivers: [],
  loading: false,
  error: null,
};

export const fetchAllDrivers = createAsyncThunk(
  "drivers/fetchAll",
  async (
    token: string,
    { rejectWithValue }
  ) => {
    try {
      const response =
        await getAllDrivers(token);

      return response.drivers;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Failed to fetch drivers"
      );
    }
  }
);
export const createDriverThunk = createAsyncThunk(
  "drivers/create",
  async (
    {
      token,
      driverData,
    }: {
      token: string;
      driverData: CreateDriverData;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await createDriver(
        token,
        driverData
      );

      return response.driver;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Failed to create driver"
      );
    }
  }
);

export const updateDriverThunk = createAsyncThunk(
  "drivers/update",
  async (
    {
      token,
      driverId,
      driverData,
    }: {
      token: string;
      driverId: string;
      driverData: UpdateDriverData;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await updateDriver(
        token,
        driverId,
        driverData
      );

      return response.driver;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Failed to update driver"
      );
    }
  }
);

const driverSlice = createSlice({
  name: "drivers",

  initialState,

  reducers: {
    clearDriverError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(
        fetchAllDrivers.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        fetchAllDrivers.fulfilled,
        (state, action) => {
          state.loading = false;
          state.drivers = action.payload;
        }
      )

      .addCase(
        fetchAllDrivers.rejected,
        (state, action) => {
          state.loading = false;
          state.error =
            (action.payload as string) ||
            "Failed to fetch drivers";
        }
      )

      .addCase(
        createDriverThunk.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addCase(
        createDriverThunk.fulfilled,
        (state, action) => {
          state.loading = false;
          state.drivers.unshift(action.payload);
        }
      )
      .addCase(
        createDriverThunk.rejected,
        (state, action) => {
          state.loading = false;
          state.error =
            (action.payload as string) ||
            "Failed to create driver";
        }
      )
      .addCase(
        updateDriverThunk.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        updateDriverThunk.fulfilled,
        (state, action) => {
          state.loading = false;

          const index = state.drivers.findIndex(
            (driver) =>
              driver._id === action.payload._id
          );

          if (index !== -1) {
            state.drivers[index] =
              action.payload;
          }
        }
      )

      .addCase(
        updateDriverThunk.rejected,
        (state, action) => {
          state.loading = false;
          state.error =
            (action.payload as string) ||
            "Failed to update driver";
        }
      );
    }
}
  )


export const {
  clearDriverError,
} = driverSlice.actions;

export default driverSlice.reducer;