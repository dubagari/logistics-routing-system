import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // ========================================
    // Basic Information
    // ========================================

    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    // ========================================
    // Authentication
    // ========================================

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    // ========================================
    // User Role
    // ========================================

    role: {
      type: String,
      enum: ["admin", "customer", "driver"],
      default: "customer",
    },

    // ========================================
    // Account Status
    // ========================================

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;