import mongoose from "mongoose";

const routeSchema = new mongoose.Schema(
  {
    // ========================================
    // Delivery Reference
    // ========================================

    delivery: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Delivery",
      required: true,
      unique: true,
    },

    // ========================================
    // Driver Reference
    // ========================================

    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // ========================================
    // Route Start Location
    // ========================================

    startLocation: {
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
    // Route Destination
    // ========================================

    destination: {
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
    // Route Information
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
    // Traffic Information
    // ========================================

    trafficLevel: {
      type: String,

      enum: [
        "low",
        "moderate",
        "high",
      ],

      default: "low",
    },

    trafficDelay: {
      type: Number,
      default: 0,
    },

    // ========================================
    // Route Status
    // ========================================

    status: {
      type: String,

      enum: [
        "planned",
        "active",
        "completed",
        "cancelled",
      ],

      default: "planned",
    },

    // ========================================
    // Route Optimization
    // ========================================

    optimized: {
      type: Boolean,
      default: false,
    },

    optimizationReason: {
      type: String,
      default: "",
      trim: true,
    },

    selectedRouteNumber: {
      type: Number,
      default: 1,
    },

    // ========================================
    // Main Route Coordinates
    // ========================================

    coordinates: [
      {
        latitude: {
          type: Number,
          required: true,
        },

        longitude: {
          type: Number,
          required: true,
        },
      },
    ],

    // ========================================
    // Alternative Routes
    // ========================================

    alternatives: [
      {
        routeNumber: {
          type: Number,
          required: true,
        },

        distance: {
          type: Number,
          default: 0,
        },

        estimatedTime: {
          type: Number,
          default: 0,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Route = mongoose.model(
  "Route",
  routeSchema
);

export default Route;