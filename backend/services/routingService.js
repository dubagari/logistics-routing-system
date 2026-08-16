const OSRM_BASE_URL =
  "https://router.project-osrm.org/route/v1/driving";

/**
 * Get road route between two coordinates
 *
 * @param {number} pickupLatitude
 * @param {number} pickupLongitude
 * @param {number} deliveryLatitude
 * @param {number} deliveryLongitude
 */
export const getRoadRoute = async (
  pickupLatitude,
  pickupLongitude,
  deliveryLatitude,
  deliveryLongitude
) => {
  try {
    const url =
      `${OSRM_BASE_URL}/` +
      `${pickupLongitude},${pickupLatitude};` +
      `${deliveryLongitude},${deliveryLatitude}` +
      `?overview=full&geometries=geojson`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `OSRM request failed: ${response.status}`
      );
    }

    const data = await response.json();

    if (
      data.code !== "Ok" ||
      !data.routes ||
      data.routes.length === 0
    ) {
      throw new Error("No route found");
    }

    const route = data.routes[0];

    return {
      distance: route.distance / 1000,
      estimatedTime: route.duration / 60,
      geometry: route.geometry,
    };
  } catch (error) {
    console.error(
      "Routing service error:",
      error.message
    );

    throw error;
  }
};