import express from "express";

import {
  getDriverProfile,
  createDriverProfile,
  updateDriverProfile,
  updateDriverLocation,
  updateDriverAvailability,
  updateDriverStatus,
  getAllDrivers,
} from "../controllers/driverController.js";

import {
  protect,
  authorize,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// ========================================
// Driver - Get Own Profile
// ========================================

router.get(
  "/profile",
  protect,
  authorize("driver"),
  getDriverProfile
);

// ========================================
// Driver - Create Profile
// ========================================

router.post(
  "/profile",
  protect,
  authorize("driver"),
  createDriverProfile
);

// ========================================
// Driver - Update Profile
// ========================================

router.put("/profile", protect, authorize("driver"), updateDriverProfile);

// ========================================
// Driver - Update GPS Location
// ========================================

router.put("/location", protect, authorize("driver"), updateDriverLocation);

// ========================================
// Driver - Update Availability
// ========================================

router.put("/availability", protect, authorize("driver"), updateDriverAvailability);

// ========================================
// Driver - Update Status
// ========================================

router.put("/status", protect, authorize("driver"), updateDriverStatus);


// ========================================
// Admin - Get All Drivers
// ========================================
router.get("/admin", protect, authorize("admin"), getAllDrivers);

export default router;