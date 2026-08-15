import Delivery from "../models/Delivery.js";
import Driver from "../models/Driver.js";
import User from "../models/User.js";

// ========================================
// Create Delivery
// Customer creates a delivery
// ========================================
export const createDelivery = async (req, res) => {
  try {
    const {
      pickupLocation,
      deliveryLocation,
      packageDescription,
      packageWeight,
      notes,
    } = req.body;

    // ========================================
    // Validate Pickup Location
    // ========================================
    if (
      !pickupLocation?.address ||
      pickupLocation.latitude === undefined ||
      pickupLocation.longitude === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid pickup location is required",
      });
    }

    // ========================================
    // Validate Delivery Location
    // ========================================
    if (
      !deliveryLocation?.address ||
      deliveryLocation.latitude === undefined ||
      deliveryLocation.longitude === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid delivery location is required",
      });
    }

    // ========================================
    // Validate Package Description
    // ========================================
    if (!packageDescription?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Package description is required",
      });
    }

    // ========================================
    // Validate Coordinates
    // ========================================
    const pickupLatitude = Number(
      pickupLocation.latitude
    );

    const pickupLongitude = Number(
      pickupLocation.longitude
    );

    const deliveryLatitude = Number(
      deliveryLocation.latitude
    );

    const deliveryLongitude = Number(
      deliveryLocation.longitude
    );

    if (
      !Number.isFinite(pickupLatitude) ||
      pickupLatitude < -90 ||
      pickupLatitude > 90
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid pickup latitude",
      });
    }

    if (
      !Number.isFinite(pickupLongitude) ||
      pickupLongitude < -180 ||
      pickupLongitude > 180
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid pickup longitude",
      });
    }

    if (
      !Number.isFinite(deliveryLatitude) ||
      deliveryLatitude < -90 ||
      deliveryLatitude > 90
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid delivery latitude",
      });
    }

    if (
      !Number.isFinite(deliveryLongitude) ||
      deliveryLongitude < -180 ||
      deliveryLongitude > 180
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid delivery longitude",
      });
    }

    // ========================================
    // Validate Package Weight
    // ========================================
    const weight = Number(packageWeight || 0);

    if (!Number.isFinite(weight) || weight < 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid package weight",
      });
    }

    // ========================================
    // Create Delivery
    // ========================================
    const delivery = await Delivery.create({
      customer: req.user._id,

      pickupLocation: {
        address: pickupLocation.address,
        latitude: pickupLatitude,
        longitude: pickupLongitude,
      },

      deliveryLocation: {
        address: deliveryLocation.address,
        latitude: deliveryLatitude,
        longitude: deliveryLongitude,
      },

      packageDescription:
        packageDescription.trim(),

      packageWeight: weight,

      notes: notes?.trim() || "",
    });

    // ========================================
    // Populate Customer
    // ========================================
    const populatedDelivery =
      await Delivery.findById(
        delivery._id
      ).populate(
        "customer",
        "-password"
      );

    return res.status(201).json({
      success: true,
      message: "Delivery created successfully",
      delivery: populatedDelivery,
    });
  } catch (error) {
    console.error(
      "Create delivery error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ========================================
// Get Customer Deliveries
// Customer gets their own deliveries
// ========================================
export const getCustomerDeliveries = async (req, res) => {
  try {
    const deliveries = await Delivery.find({
      customer: req.user._id,
    })
        .populate(  "customer", "-password")
        .populate("driver", "-password")
        .sort({
          createdAt: -1,
        });

    return res.json({
      success: true,
      count: deliveries.length,
      deliveries,
    });
  } catch (error) {
    console.error(
      "Get customer deliveries error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ========================================
// Get Delivery By ID
// Customer or Driver gets a delivery
// ========================================
export const getDeliveryById = async (req, res) => {
  try {
    const delivery = await Delivery.findById(req.params.id)
        .populate("customer", "-password")
        .populate("driver", "-password");

    if (!delivery) {
      return res.status(404).json({
        success: false,
        message: "Delivery not found",
      });
    }

    // ========================================
    // Customer Authorization
    // ========================================
    if (req.user.role === "customer") {
      if (
        delivery.customer._id.toString() !==
        req.user._id.toString()
      ) {
        return res.status(403).json({
          success: false,
          message:
            "You do not have permission to view this delivery",
        });
      }
    }

    // ========================================
    // Driver Authorization
    // ========================================
    if (req.user.role === "driver") {
      if (
        !delivery.driver ||
        delivery.driver._id.toString() !==
        req.user._id.toString()
      ) {
        return res.status(403).json({
          success: false,
          message:
            "You do not have permission to view this delivery",
        });
      }
    }

    return res.json({
      success: true,
      delivery,
    });
  } catch (error) {
    console.error(
      "Get delivery error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// ========================================
// Admin - Get All Deliveries
// ========================================
export const getAllDeliveries = async (  req,  res) => {
  try {
    // ----------------------------------------
    // Get Status Filter
    // ----------------------------------------

    const { status } = req.query;

    // ----------------------------------------
    // Build Query
    // ----------------------------------------

    const query = {};

    if (status) {
      const allowedStatuses = [
        "pending",
        "assigned",
        "accepted",
        "in_transit",
        "delivered",
        "cancelled",
      ];

      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid delivery status",
        });
      }

      query.status = status;
    }

    // ----------------------------------------
    // Find Deliveries
    // ----------------------------------------

    const deliveries =
      await Delivery.find(query)
        .populate(
          "customer",
          "-password"
        )
        .populate(
          "driver",
          "-password"
        )
        .sort({
          createdAt: -1,
        });

    // ----------------------------------------
    // Response
    // ----------------------------------------

    return res.json({
      success: true,
      count: deliveries.length,
      deliveries,
    });
  } catch (error) {
    console.error(
      "Get all deliveries error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ========================================
// Admin - Assign Driver
// ========================================
export const assignDriver = async (req, res) => {
  try {
    const { driverId } = req.body;

    // ========================================
    // Validate Driver ID
    // ========================================

    if (!driverId) {
      return res.status(400).json({
        success: false,
        message: "Driver ID is required",
      });
    }

    // ========================================
    // Find Driver Profile
    // ========================================

    const driver = await Driver.findOne({
      _id: driverId,
    });


    if (!driver) {
      return res.status(404).json({
        success: false,
        message: "Driver not found",
      });
    }

    // ========================================
    // Driver Must Be Available
    // ========================================

    if (
      !driver.isAvailable ||
      driver.status !== "available"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Driver is not available for assignment",
      });
    }

    // ========================================
    // Find Delivery
    // ========================================

    const delivery =
      await Delivery.findById(
        req.params.id
      );

    if (!delivery) {
      return res.status(404).json({
        success: false,
        message: "Delivery not found",
      });
    }

    // ========================================
    // Delivery Must Be Pending
    // ========================================

    if (delivery.status !== "pending") {
      return res.status(400).json({
        success: false,
        message:
          "Only pending deliveries can be assigned",
      });
    }

    // ========================================
    // Assign Driver
    // ========================================

    delivery.driver = driver.user;

    delivery.status = "assigned";

    delivery.assignedAt = new Date();

    await delivery.save();

    // ========================================
    // Return Populated Delivery
    // ========================================

    const populatedDelivery =
      await Delivery.findById(
        delivery._id
      )
        .populate(
          "customer",
          "-password"
        )
        .populate(
          "driver",
          "-password"
        );

    return res.json({
      success: true,
      message:
        "Driver assigned successfully",
      delivery: populatedDelivery,
    });
  } catch (error) {
    console.error(
      "Assign driver error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ========================================
// Driver - Accept Delivery
// ========================================

export const acceptDelivery = async (
  req,
  res
) => {
  try {
    // ----------------------------------------
    // Find Delivery
    // ----------------------------------------

    const delivery =
      await Delivery.findById(
        req.params.id
      );

    if (!delivery) {
      return res.status(404).json({
        success: false,
        message: "Delivery not found",
      });
    }

    // ----------------------------------------
    // Verify Driver Assignment
    // ----------------------------------------

    if (
      !delivery.driver ||
      delivery.driver.toString() !==
        req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          "This delivery is not assigned to you",
      });
    }

    // ----------------------------------------
    // Delivery Must Be Assigned
    // ----------------------------------------

    if (
      delivery.status !== "assigned"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Only assigned deliveries can be accepted",
      });
    }

    // ----------------------------------------
    // Accept Delivery
    // ----------------------------------------

    delivery.status = "accepted";

    delivery.acceptedAt = new Date();

    await delivery.save();

    // ----------------------------------------
    // Return Delivery
    // ----------------------------------------

    const updatedDelivery =
      await Delivery.findById(
        delivery._id
      )
        .populate(
          "customer",
          "-password"
        )
        .populate(
          "driver",
          "-password"
        );

    return res.json({
      success: true,
      message:
        "Delivery accepted successfully",
      delivery: updatedDelivery,
    });
  } catch (error) {
    console.error(
      "Accept delivery error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ========================================
// Driver - Start Delivery
// ========================================

export const startDelivery = async (
  req,
  res
) => {
  try {
    // ----------------------------------------
    // Find Delivery
    // ----------------------------------------

    const delivery =
      await Delivery.findById(
        req.params.id
      );

    if (!delivery) {
      return res.status(404).json({
        success: false,
        message: "Delivery not found",
      });
    }

    // ----------------------------------------
    // Verify Driver Assignment
    // ----------------------------------------

    if (
      !delivery.driver ||
      delivery.driver.toString() !==
        req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          "This delivery is not assigned to you",
      });
    }

    // ----------------------------------------
    // Delivery Must Be Accepted
    // ----------------------------------------

    if (
      delivery.status !== "accepted"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Only accepted deliveries can be started",
      });
    }

    // ----------------------------------------
    // Start Delivery
    // ----------------------------------------

    delivery.status = "in_transit";

    delivery.startedAt = new Date();

    await delivery.save();

    // ----------------------------------------
    // Return Updated Delivery
    // ----------------------------------------

    const updatedDelivery =
      await Delivery.findById(
        delivery._id
      )
        .populate(
          "customer",
          "-password"
        )
        .populate(
          "driver",
          "-password"
        );

    return res.json({
      success: true,
      message:
        "Delivery started successfully",
      delivery: updatedDelivery,
    });
  } catch (error) {
    console.error(
      "Start delivery error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// ========================================
// Driver - Update Delivery Location
// ========================================

export const updateDeliveryLocation = async (
  req,
  res
) => {
  try {
    const {
      latitude,
      longitude,
    } = req.body;

    // ----------------------------------------
    // Validate Coordinates
    // ----------------------------------------

    if (
      latitude === undefined ||
      longitude === undefined
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Latitude and longitude are required",
      });
    }

    if (
      typeof latitude !== "number" ||
      typeof longitude !== "number"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Latitude and longitude must be numbers",
      });
    }

    if (
      latitude < -90 ||
      latitude > 90 ||
      longitude < -180 ||
      longitude > 180
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid GPS coordinates",
      });
    }

    // ----------------------------------------
    // Find Delivery
    // ----------------------------------------

    const delivery =
      await Delivery.findById(
        req.params.id
      );

    if (!delivery) {
      return res.status(404).json({
        success: false,
        message: "Delivery not found",
      });
    }

    // ----------------------------------------
    // Verify Driver
    // ----------------------------------------

    if (
      !delivery.driver ||
      delivery.driver.toString() !==
        req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          "This delivery is not assigned to you",
      });
    }

    // ----------------------------------------
    // Delivery Must Be In Transit
    // ----------------------------------------

    if (
      delivery.status !== "in_transit"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "GPS location can only be updated for an in-transit delivery",
      });
    }

    // ----------------------------------------
    // Update Location
    // ----------------------------------------

    delivery.currentLocation = {
      latitude,
      longitude,
      updatedAt: new Date(),
    };

    await delivery.save();

    return res.json({
      success: true,
      message:
        "Delivery location updated successfully",
      location:
        delivery.currentLocation,
    });
  } catch (error) {
    console.error(
      "Update delivery location error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ========================================
// Driver - Complete Delivery
// ========================================

export const completeDelivery = async (
  req,
  res
) => {
  try {
    // ----------------------------------------
    // Find Delivery
    // ----------------------------------------

    const delivery =
      await Delivery.findById(
        req.params.id
      );

    if (!delivery) {
      return res.status(404).json({
        success: false,
        message: "Delivery not found",
      });
    }

    // ----------------------------------------
    // Verify Driver
    // ----------------------------------------

    if (
      !delivery.driver ||
      delivery.driver.toString() !==
        req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          "This delivery is not assigned to you",
      });
    }

    // ----------------------------------------
    // Delivery Must Be In Transit
    // ----------------------------------------

    if (
      delivery.status !== "in_transit"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Only in-transit deliveries can be completed",
      });
    }

    // ----------------------------------------
    // Complete Delivery
    // ----------------------------------------

    delivery.status = "delivered";

    delivery.deliveredAt = new Date();

    await delivery.save();

    // ----------------------------------------
    // Return Updated Delivery
    // ----------------------------------------

    const updatedDelivery =
      await Delivery.findById(
        delivery._id
      )
        .populate(
          "customer",
          "-password"
        )
        .populate(
          "driver",
          "-password"
        );

    return res.json({
      success: true,
      message:
        "Delivery completed successfully",
      delivery: updatedDelivery,
    });
  } catch (error) {
    console.error(
      "Complete delivery error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ========================================
// Customer - Track Delivery
// ========================================

export const trackDelivery = async (req,res) => {
  try {
    // ----------------------------------------
    // Find Delivery
    // ----------------------------------------

    const delivery = await Delivery.findById(req.params.id)
    .populate("customer", "-password")
    .populate("driver", "-password");

    if (!delivery) {
      return res.status(404).json({
        success: false,
        message: "Delivery not found",
      });
    }

    // ----------------------------------------
    // Verify Customer Ownership
    // ----------------------------------------

    if (delivery.customer._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message:"You do not have permission to track this delivery",
      });
    }

    // ----------------------------------------
    // Return Tracking Information
    // ----------------------------------------

    return res.json({
      success: true,
      tracking: {
        deliveryId: delivery._id,

        status: delivery.status,

        driver: delivery.driver
          ? {
              _id: delivery.driver._id,
              name: delivery.driver.name,
              phone: delivery.driver.phone,
            }
          : null,

        pickupLocation:
          delivery.pickupLocation,

        deliveryLocation:
          delivery.deliveryLocation,

        currentLocation:
          delivery.currentLocation,

        distance: delivery.distance,

        estimatedTime:
          delivery.estimatedTime,

        assignedAt:
          delivery.assignedAt,

        acceptedAt:
          delivery.acceptedAt,

        startedAt:
          delivery.startedAt,

        deliveredAt:
          delivery.deliveredAt,
      },
    });
  } catch (error) {
    console.error(
      "Track delivery error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ========================================
// Customer - Delivery History
// ========================================

export const getCustomerDeliveryHistory = async (req,res) => {
  try {
    // ----------------------------------------
    // Find Customer Deliveries
    // ----------------------------------------

    const deliveries =
      await Delivery.find({
        customer: req.user._id,
      })
        .populate(
          "driver",
          "-password"
        )
        .sort({
          createdAt: -1,
        });

    return res.json({
      success: true,
      count: deliveries.length,
      deliveries,
    });
  } catch (error) {
    console.error(
      "Get customer delivery history error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ========================================
// Admin - Get Delivery By ID
// ========================================

export const getAdminDeliveryById = async (req, res) => {
  try {
    // ----------------------------------------
    // Find Delivery
    // ----------------------------------------

    const delivery = await Delivery.findById(req.params.id)
    .populate("customer", "-password")
    .populate("driver", "-password");

    // ----------------------------------------
    // Delivery Not Found
    // ----------------------------------------

    if (!delivery) {
      return res.status(404).json({
        success: false,
        message: "Delivery not found",
      });
    }

    // ----------------------------------------
    // Return Delivery
    // ----------------------------------------

    return res.json({
      success: true,
      delivery,
    });
  } catch (error) {
    console.error(
      "Get admin delivery error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};