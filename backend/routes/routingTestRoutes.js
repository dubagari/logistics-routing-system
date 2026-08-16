import express from "express";

import {  getRoadRoute} from "../services/routingService.js";

const router = express.Router();

router.get("/test-route", async (req, res) => {
  try {
    const route = await getRoadRoute(
      10.3158,
      9.8442,
      10.3103,
      9.8463
    );

    return res.json({
      success: true,
      route,
    });
  } catch (error) {
    console.error(
      "Test route error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to calculate road route",
    });
  }
});

export default router;