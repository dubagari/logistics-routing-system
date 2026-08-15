import dns from "node:dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);



import dotenv from "dotenv";
import bcrypt from "bcryptjs";

import connectDB from "../config/db.js";
import User from "../models/User.js";

dotenv.config();

// ========================================
// Admin Seed
// ========================================

const seedAdmin = async () => {
  try {
   
    await connectDB();

    const adminEmail = "admin@test.com";
    const adminPassword = "Admin@123456";

    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log("Admin already exists");

      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(adminPassword,12);
    
        const admin = await User.create({
        name: "System Admin",
        email: adminEmail,
        phone: "07000000000",
        password: hashedPassword,
        role: "admin",
        isActive: true,
      });

    console.log("========================================");
    console.log("Admin created successfully");
    console.log("Admin ID:",admin._id.toString());

    console.log("Email:",admin.email);
    console.log("Role:",admin.role);
    console.log("========================================");

    process.exit(0);
  } catch (error) {
    console.error("Admin seed error:", error);

    process.exit(1);
  }
};

seedAdmin();