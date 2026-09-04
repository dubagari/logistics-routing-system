import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./slices/authSlice";
import deliveryReducer from "./slices/deliverySlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    deliveries: deliveryReducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Delivery routes contain large geometry coordinate arrays.
        // Ignore them during Redux serializability checks.
        ignoredPaths: [
          "deliveries.deliveries",
        ],
        ignoredActions: [
          "deliveries/getCustomerDeliveryById/fulfilled",
          "deliveries/getDriverDeliveries/fulfilled",
        ],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
