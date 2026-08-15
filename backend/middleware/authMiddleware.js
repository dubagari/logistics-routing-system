import jwt from "jsonwebtoken";

import User from "../models/User.js";

// ========================================
// Protect Route
// ========================================

export const protect = async (req, res, next) => {
  try {
    // ----------------------------------------
    // Get Authorization Header
    // ----------------------------------------

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message:
          "Not authorized. No token provided",
      });
    }

    // ----------------------------------------
    // Extract Token
    // ----------------------------------------

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message:
          "Not authorized. Invalid token",
      });
    }

    // ----------------------------------------
    // Verify Token
    // ----------------------------------------

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ----------------------------------------
    // Find User
    // ----------------------------------------

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message:
          "User account no longer exists",
      });
    }

    // ----------------------------------------
    // Check Account Status
    // ----------------------------------------

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Your account is inactive",
      });
    }

    // ----------------------------------------
    // Attach User To Request
    // ----------------------------------------

    req.user = user;

    next();
  } catch (error) {
    console.error("Authentication error:", error);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token has expired",
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ========================================
// Authorize Roles
// ========================================

export const authorize = (...roles) => {
    return (req, res, next) => {
      // ----------------------------------------
      // User must already be authenticated
      // ----------------------------------------

    

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message:
            "Not authorized",
        });
      }

      // ----------------------------------------
      // Check User Role
      // ----------------------------------------

      if (
        !roles.includes(
          req.user.role
        )
      ) {
        return res.status(403).json({
          success: false,
          message:
            "You do not have permission to access this resource",
        });
      }

      next();
    };
  };