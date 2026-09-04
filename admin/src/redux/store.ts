import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./slices/authSlice";
import customerReducer from "./slices/customerSlice";
import dashboardReducer from "./slices/dashboardSlice";
import deliveryReducer from "./slices/deliverySlice";
import driverReducer from "./slices/driverSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,
    deliveries: deliveryReducer,
    drivers: driverReducer,
    customers: customerReducer,
  },
});

export type RootState =
  ReturnType<typeof store.getState>;

export type AppDispatch =
  typeof store.dispatch;