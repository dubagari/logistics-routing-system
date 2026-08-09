import { configureStore } from "@reduxjs/toolkit";
import deliveryReducer from "./slices/deliverySlice";

export const store = configureStore({
  reducer: {
    deliveries: deliveryReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;