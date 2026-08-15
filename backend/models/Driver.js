import mongoose from "mongoose";

const driverSchema = new mongoose.Schema(
  {
    // ========================================
    // User Reference
    // ========================================

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    // ========================================
    // Driver Information
    // ========================================

    licenseNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    // ========================================
    // Vehicle Information
    // ========================================

    vehicleType: {
      type: String,
      required: true,
      trim: true,
    },

    vehicleNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    vehicleModel: {
      type: String,
      trim: true,
      default: "",

    },
    

    // ========================================
    // Availability
    // ========================================

    isAvailable: {
      type: Boolean,
      default: true,
    },

    // ========================================
    // Current GPS Location
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
    // Driver Status
    // ========================================

    status: {
      type: String,
      enum: [
        "offline",
        "available",
        "on_delivery",
      ],
      default: "offline",
    },
  },
  {
    timestamps: true,
  }
);

const Driver = mongoose.model(
  "Driver",
  driverSchema
);

export default Driver;