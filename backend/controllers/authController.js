import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/User.js";

// ========================================
// Generate JWT Token
// ========================================

const generateToken = (userId) => {
  return jwt.sign(
    {
      id: userId,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

// ========================================
// Register User
// ========================================

export const register = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      role,
    } = req.body;

    // ----------------------------------------
    // Validate required fields
    // ----------------------------------------

    if (
      !name ||
      !email ||
      !phone ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Name, email, phone and password are required",
      });
    }

    // ----------------------------------------
    // Validate password
    // ----------------------------------------

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 6 characters",
      });
    }

    // ----------------------------------------
    // Check existing user
    // ----------------------------------------

    const existingUser =
      await User.findOne({
        email: email.toLowerCase(),
      });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message:
          "User with this email already exists",
      });
    }

    // ----------------------------------------
    // Validate role
    // ----------------------------------------

    const allowedRoles = [
      "customer",
      "driver",
      "admin",
    ];

    const selectedRole =
      role || "customer";

    if (
      !allowedRoles.includes(
        selectedRole
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid user role",
      });
    }

    // ----------------------------------------
    // Hash password
    // ----------------------------------------

    const hashedPassword =
      await bcrypt.hash(
        password,
        12
      );

    // ----------------------------------------
    // Create user
    // ----------------------------------------

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      phone,
      password: hashedPassword,
      role: selectedRole,
    });

    // ----------------------------------------
    // Generate token
    // ----------------------------------------

    const token =
      generateToken(user._id);

    // ----------------------------------------
    // Response
    // ----------------------------------------

    return res.status(201).json({
      success: true,
      message:
        "User registered successfully",

      token,

      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    console.error(
      "Register error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ========================================
// Login User
// ========================================

export const login = async (req, res) => {
  try {
    const {
      email,
      password,
    } = req.body;

    // ----------------------------------------
    // Validate
    // ----------------------------------------

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Email and password are required",
      });
    }

    // ----------------------------------------
    // Find user
    // ----------------------------------------

    const user =
      await User.findOne({
        email: email.toLowerCase(),
      });

    if (!user) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password",
      });
    }

    // ----------------------------------------
    // Check account status
    // ----------------------------------------

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message:
          "Your account is inactive",
      });
    }

    // ----------------------------------------
    // Compare password
    // ----------------------------------------

    const passwordMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password",
      });
    }

    // ----------------------------------------
    // Generate token
    // ----------------------------------------

    const token =
      generateToken(user._id);

    // ----------------------------------------
    // Response
    // ----------------------------------------

    return res.json({
      success: true,
      message:
        "Login successful",

      token,

      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    console.error(
      "Login error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};