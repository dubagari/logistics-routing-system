import dns from "node:dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);

import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";

import driverRoutes from "./routes/driverRoutes.js";

import deliveryRoutes from "./routes/deliveryRoutes.js";

import routingTestRoutes from "./routes/routingTestRoutes.js";





dotenv.config();

const app = express();

// ========================================
// Database
// ========================================

connectDB();

// ========================================
// Middleware
// ========================================

app.use(cors());

app.use(express.json());

// ========================================
// Test Route
// ========================================

app.use("/api/auth", authRoutes);

app.use("/api/drivers", driverRoutes);


app.use("/api/routing", routingTestRoutes);

// ========================================
// Delivery Routes
// ========================================

app.use("/api/deliveries",deliveryRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Delivery Management API is running",
  });
});

// ========================================
// Server
// ========================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server running on http://localhost:${PORT}`
  );
});