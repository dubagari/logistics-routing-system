import Driver from "../models/Driver.js";

// ========================================
// Create Driver Profile
// ========================================

export const createDriverProfile = async (req,res) => {
  try {
    const {
      licenseNumber,
      vehicleType,
      vehicleNumber,
      vehicleModel,
    } = req.body;

    // ----------------------------------------
    // Validate required fields
    // ----------------------------------------

    if (!licenseNumber || !vehicleType || !vehicleNumber) {
      return res.status(400).json({
        success: false,
        message: "License number, vehicle type and vehicle number are required",
      });
    }

    // ----------------------------------------
    // Check existing profile
    // ----------------------------------------

    const existingProfile =
      await Driver.findOne({
        user: req.user._id,
      });

    if (existingProfile) {
      return res.status(400).json({
        success: false,
        message:
          "Driver profile already exists",
      });
    }

    // ----------------------------------------
    // Check license number
    // ----------------------------------------

    const existingLicense =
      await Driver.findOne({
        licenseNumber,
      });

    if (existingLicense) {
      return res.status(400).json({
        success: false,
        message:
          "License number is already registered",
      });
    }

    // ----------------------------------------
    // Check vehicle number
    // ----------------------------------------

    const existingVehicle =
      await Driver.findOne({
        vehicleNumber,
      });

    if (existingVehicle) {
      return res.status(400).json({
        success: false,
        message:
          "Vehicle number is already registered",
      });
    }

    // ----------------------------------------
    // Create Driver Profile
    // ----------------------------------------

    const driver =
      await Driver.create({
        user: req.user._id,
        licenseNumber,
        vehicleType,
        vehicleNumber,
        vehicleModel:
          vehicleModel || "",
        isAvailable: true,
        status: "available",
      });

    // ----------------------------------------
    // Populate User
    // ----------------------------------------

    const populatedDriver =
      await Driver.findById(
        driver._id
      ).populate(
        "user",
        "-password"
      );

    return res.status(201).json({
      success: true,
      message:
        "Driver profile created successfully",
      driver:
        populatedDriver,
    });
  } catch (error) {
    console.error(
      "Create driver profile error:",
      error
    );

    // ----------------------------------------
    // Handle duplicate key errors
    // ----------------------------------------

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message:
          "License number or vehicle number already exists",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ========================================
// Get Driver Profile
// ========================================

export const getDriverProfile = async (
  req,
  res
) => {
  try {
    const driver =
      await Driver.findOne({
        user: req.user._id,
      }).populate(
        "user",
        "-password"
      );

    if (!driver) {
      return res.status(404).json({
        success: false,
        message:
          "Driver profile not found",
      });
    }

    return res.json({
      success: true,
      driver,
    });
  } catch (error) {
    console.error(
      "Get driver profile error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ========================================
// Update Driver Profile
// ========================================

export const updateDriverProfile = async (
  req,
  res
) => {
  try {
    const {
      licenseNumber,
      vehicleType,
      vehicleNumber,
      vehicleModel,
    } = req.body;

    // ----------------------------------------
    // Find Driver
    // ----------------------------------------

    const driver =
      await Driver.findOne({
        user: req.user._id,
      });

    if (!driver) {
      return res.status(404).json({
        success: false,
        message:
          "Driver profile not found",
      });
    }

    // ----------------------------------------
    // Check license number
    // ----------------------------------------

    if (
      licenseNumber &&
      licenseNumber !==
        driver.licenseNumber
    ) {
      const existingLicense =
        await Driver.findOne({
          licenseNumber,
          _id: {
            $ne: driver._id,
          },
        });

      if (existingLicense) {
        return res.status(400).json({
          success: false,
          message:
            "License number is already registered",
        });
      }

      driver.licenseNumber =
        licenseNumber;
    }

    // ----------------------------------------
    // Check vehicle number
    // ----------------------------------------

    if (
      vehicleNumber &&
      vehicleNumber !==
        driver.vehicleNumber
    ) {
      const existingVehicle =
        await Driver.findOne({
          vehicleNumber,
          _id: {
            $ne: driver._id,
          },
        });

      if (existingVehicle) {
        return res.status(400).json({
          success: false,
          message:
            "Vehicle number is already registered",
        });
      }

      driver.vehicleNumber =
        vehicleNumber;
    }

    // ----------------------------------------
    // Update fields
    // ----------------------------------------

    if (vehicleType) {
      driver.vehicleType =
        vehicleType;
    }

    if (
      vehicleModel !== undefined
    ) {
      driver.vehicleModel =
        vehicleModel;
    }

    await driver.save();

    // ----------------------------------------
    // Populate User
    // ----------------------------------------

    const populatedDriver =
      await Driver.findById(
        driver._id
      ).populate(
        "user",
        "-password"
      );

    return res.json({
      success: true,
      message:
        "Driver profile updated successfully",
      driver:
        populatedDriver,
    });
  } catch (error) {
    console.error(
      "Update driver profile error:",
      error
    );

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message:
          "License number or vehicle number already exists",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ========================================
// Update Driver Availability
// ========================================

export const updateDriverAvailability =
  async (req, res) => {
    try {
      const {
        isAvailable,
      } = req.body;

      // ----------------------------------------
      // Validate
      // ----------------------------------------

      if (
        typeof isAvailable !==
        "boolean"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "isAvailable must be true or false",
        });
      }

      // ----------------------------------------
      // Find Driver
      // ----------------------------------------

      const driver =
        await Driver.findOne({
          user: req.user._id,
        });

      if (!driver) {
        return res.status(404).json({
          success: false,
          message:
            "Driver profile not found",
        });
      }

      // ----------------------------------------
      // Prevent going offline during delivery
      // ----------------------------------------

      if (
        driver.status ===
          "on_delivery" &&
        isAvailable === false
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Driver cannot become unavailable while on delivery",
        });
      }

      // ----------------------------------------
      // Update
      // ----------------------------------------

      driver.isAvailable =
        isAvailable;

      driver.status = isAvailable
        ? "available"
        : "offline";

      await driver.save();

      return res.json({
        success: true,
        message:
          "Driver availability updated successfully",
        driver,
      });
    } catch (error) {
      console.error(
        "Update driver availability error:",
        error
      );

      return res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  };

// ========================================
// Update Driver Status
// ========================================

export const updateDriverStatus =
  async (req, res) => {
    try {
      const {
        status,
      } = req.body;

      // ----------------------------------------
      // Validate status
      // ----------------------------------------

      const allowedStatuses = [
        "offline",
        "available",
        "on_delivery",
      ];

      if (
        !allowedStatuses.includes(
          status
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid driver status",
        });
      }

      // ----------------------------------------
      // Find Driver
      // ----------------------------------------

      const driver =
        await Driver.findOne({
          user: req.user._id,
        });

      if (!driver) {
        return res.status(404).json({
          success: false,
          message:
            "Driver profile not found",
        });
      }

      // ----------------------------------------
      // on_delivery requires availability
      // ----------------------------------------

      if (
        status === "on_delivery" &&
        !driver.isAvailable
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Driver must be available before going on delivery",
        });
      }

      // ----------------------------------------
      // Update status
      // ----------------------------------------

      driver.status = status;

      if (status === "offline") {
        driver.isAvailable = false;
      }

      if (status === "available") {
        driver.isAvailable = true;
      }


      if (status === "on_delivery") {
        driver.isAvailable = false;
      }

      await driver.save();

      return res.json({
        success: true,
        message:
          "Driver status updated successfully",
        driver,
      });
    } catch (error) {
      console.error(
        "Update driver status error:",
        error
      );

      return res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  };

// ========================================
// Update Driver GPS Location
// ========================================

export const updateDriverLocation =
  async (req, res) => {
    try {
      const {
        latitude,
        longitude,
      } = req.body;

      // ----------------------------------------
      // Convert to numbers
      // ----------------------------------------

      const lat =
        Number(latitude);

      const lng =
        Number(longitude);

      // ----------------------------------------
      // Validate coordinates
      // ----------------------------------------

      if (
        latitude === undefined ||
        longitude === undefined ||
        !Number.isFinite(lat) ||
        !Number.isFinite(lng) ||
        lat < -90 ||
        lat > 90 ||
        lng < -180 ||
        lng > 180
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Valid latitude and longitude are required",
        });
      }

      // ----------------------------------------
      // Find Driver
      // ----------------------------------------

      const driver =
        await Driver.findOne({
          user: req.user._id,
        });

      if (!driver) {
        return res.status(404).json({
          success: false,
          message:
            "Driver profile not found",
        });
      }

      // ----------------------------------------
      // Update Location
      // ----------------------------------------

      const updatedAt =
        new Date();

      driver.currentLocation = {
        latitude: lat,
        longitude: lng,
        updatedAt,
      };

      await driver.save();

      return res.json({
        success: true,
        message:
          "Driver location updated successfully",
        location:
          driver.currentLocation,
      });
    } catch (error) {
      console.error(
        "Update driver location error:",
        error
      );

      return res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  };

  // ========================================
// Admin - Get All Drivers
// ========================================
export const getAllDrivers = async (req, res) => {
  try {
    const drivers = await Driver.find()
      .populate("user", "-password")
      .sort({
        createdAt: -1,
      });

    return res.json({
      success: true,
      count: drivers.length,
      drivers,
    });
  } catch (error) {
    console.error(
      "Get all drivers error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};