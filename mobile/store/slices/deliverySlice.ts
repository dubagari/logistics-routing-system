import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Delivery, DeliveryStatus } from "../../types/Delivery";

interface DeliveryState {
  deliveries: Delivery[];
}

const initialState: DeliveryState = {
  deliveries: [
    {
      id: "1",
      orderNumber: "ORD-001",
      customerName: "Muhammad Bello",
      customerPhone: "08012345678",
      pickupLocation: "Central Warehouse",
      deliveryLocation: "Bauchi GRA",
      status: "pending",
      distance: 8.5,
      estimatedTime: 18,
    },
    {
      id: "2",
      orderNumber: "ORD-002",
      customerName: "Aisha Ibrahim",
      customerPhone: "08023456789",
      pickupLocation: "Central Warehouse",
      deliveryLocation: "Wunti Market",
      status: "in_transit",
      distance: 5.2,
      estimatedTime: 12,
    },
    {
      id: "3",
      orderNumber: "ORD-003",
      customerName: "Abdullahi Musa",
      customerPhone: "08034567890",
      pickupLocation: "Central Warehouse",
      deliveryLocation: "GRA Phase 2",
      status: "delivered",
      distance: 11.4,
      estimatedTime: 25,
    },
  ],
};

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
      const delivery = state.deliveries.find(
        (item) => item.id === action.payload.id
      );

      if (delivery) {
        delivery.status = action.payload.status;
      }
    },
  },
});

export const { updateDeliveryStatus } = deliverySlice.actions;

export default deliverySlice.reducer;