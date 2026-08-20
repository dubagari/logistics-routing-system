import { configureStore } from "@reduxjs/toolkit";
import deliveryReducer from "./slices/deliverySlice";
import authReducer from "./slices/authSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    deliveries: deliveryReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;