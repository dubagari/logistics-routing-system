import express from "express";

import {
  createDelivery,
  getCustomerDeliveries,
  getDeliveryById,
  getAllDeliveries,
  assignDriver,
  acceptDelivery,
  startDelivery,
  updateDeliveryLocation,
  completeDelivery,
  trackDelivery,
  getCustomerDeliveryHistory,
  getAdminDeliveryById,
} from "../controllers/deliveryController.js";

import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// ========================================
// Customer - Create Delivery
// ========================================
router.post("/", protect, authorize("customer"), createDelivery);

// ========================================
// Customer - Get Own Deliveries
// ========================================
router.get("/customer", protect, authorize("customer"), getCustomerDeliveries);

// ========================================
// Admin - Get All Deliveries
// ========================================
router.get("/admin", protect, authorize("admin"), getAllDeliveries);


// Admin - Assign Driver
// ========================================
router.put("/:id/assign", protect, authorize("admin"), assignDriver);

// ========================================
// Driver - Accept Delivery
// ========================================

router.put("/:id/accept", protect, authorize("driver"), acceptDelivery);

// ========================================
// Driver - Start Delivery
// ========================================

router.put(  "/:id/start",  protect,  authorize("driver"),  startDelivery);

// ========================================
// Driver - Update Delivery Location
// ========================================

router.put(  "/:id/location",  protect,  authorize("driver"),  updateDeliveryLocation);

// ========================================
// Driver - Complete Delivery
// ========================================

router.put(  "/:id/complete",  protect,  authorize("driver"),  completeDelivery);



// ========================================
// Customer - Delivery History
// ========================================

router.get("/history", protect, authorize("customer"), getCustomerDeliveryHistory);


// ========================================
// Customer - Track Delivery
// ========================================

router.get("/:id/track", protect, authorize("customer"), trackDelivery);


// ========================================
// Customer / Driver - Get Delivery
// ========================================
router.get("/:id", protect, authorize("customer", "driver"), getDeliveryById);

// ========================================
// Admin - Get Delivery By ID
// ========================================

router.get("/admin/:id", protect, authorize("admin"), getAdminDeliveryById);

export default router;