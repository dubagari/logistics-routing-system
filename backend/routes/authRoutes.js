import express from "express";

import { register,login, getAllCustomers } from "../controllers/authController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// ========================================
// Register
// ========================================

router.post("/register", register);

// ========================================
// Login
// ========================================

router.post("/login", login);


// ========================================
// Admin - Get All Customers
// ========================================

router.get("/customers", protect, authorize("admin"), getAllCustomers);

export default router;