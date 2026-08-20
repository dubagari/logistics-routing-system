import {  configureStore} from "@reduxjs/toolkit";

import authReducer from "./slices/authSlice";
import deliveryReducer from "./slices/deliverySlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    deliveries: deliveryReducer,
  },
});

export type RootState =  ReturnType<typeof store.getState>;

export type AppDispatch =  typeof store.dispatch;