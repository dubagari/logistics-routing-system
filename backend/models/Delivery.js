import mongoose from "mongoose";

const deliverySchema = new mongoose.Schema(
  {
    // ========================================
    // Customer
    // ========================================

    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ========================================
    // Driver
    // ========================================

    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // ========================================
    // Pickup Location
    // ========================================

    pickupLocation: {
      address: {
        type: String,
        required: true,
        trim: true,
      },

      latitude: {
        type: Number,
        required: true,
      },

      longitude: {
        type: Number,
        required: true,
      },
    },

    // ========================================
    // Delivery Location
    // ========================================

    deliveryLocation: {
      address: {
        type: String,
        required: true,
        trim: true,
      },

      latitude: {
        type: Number,
        required: true,
      },

      longitude: {
        type: Number,
        required: true,
      },
    },

    // ========================================
    // Driver's Current Location
    // ========================================

    currentLocation: {
      latitude: {
        type: Number,
        default: null,
      },

      longitude: {
        type: Number,
        default: null,
      },

      updatedAt: {
        type: Date,
        default: null,
      },
    },

    // ========================================
    // Package Information
    // ========================================

    packageDescription: {
      type: String,
      required: true,
      trim: true,
    },

    packageWeight: {
      type: Number,
      default: 0,
      min: 0,
    },

    notes: {
      type: String,
      trim: true,
      default: "",
    },

    // ========================================
    // Delivery Information
    // ========================================

    distance: {
      type: Number,
      default: 0,
    },

    estimatedTime: {
      type: Number,
      default: 0,
    },


    // ========================================
// Route Geometry
// ========================================

routeGeometry: {
  type: {
    type: String,
    enum: ["LineString"],
    default: "LineString",
  },

  coordinates: {
    type: [[Number]],
    default: [],
  },
},


    // ========================================
    // Delivery Status
    // ========================================

    status: {
      type: String,

      enum: [
        "pending",
        "assigned",
        "accepted",
        "in_transit",
        "delivered",
        "cancelled",
      ],

      default: "pending",
    },


    // ========================================
    // Delivery Timeline
    // ========================================

    assignedAt: {
      type: Date,
      default: null,
    },

    acceptedAt: {
      type: Date,
      default: null,
    },

    startedAt: {
      type: Date,
      default: null,
    },

    deliveredAt: {
      type: Date,
      default: null,
    },

    cancelledAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Delivery = mongoose.model(
  "Delivery",
  deliverySchema
);

export default Delivery;