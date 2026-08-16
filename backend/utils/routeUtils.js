/**
 * Calculate distance between two GPS coordinates
 * using the Haversine formula.
 *
 * Returns distance in kilometers.
 */
export const calculateDistance = (
  latitude1,
  longitude1,
  latitude2,
  longitude2
) => {
  const R = 6371;

  const dLat =
    ((latitude2 - latitude1) * Math.PI) / 180;

  const dLon =
    ((longitude2 - longitude1) * Math.PI) / 180;

  const lat1 =
    (latitude1 * Math.PI) / 180;

  const lat2 =
    (latitude2 * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) *
      Math.sin(dLat / 2) +
    Math.cos(lat1) *
      Math.cos(lat2) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c =
    2 *
    Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    );

  return R * c;
};


/**
 * Calculate the shortest distance from a GPS point
 * to the route geometry.
 *
 * routeCoordinates format:
 *
 * [
 *   [longitude, latitude],
 *   [longitude, latitude],
 *   ...
 * ]
 *
 * Returns distance in kilometers.
 */
export const calculateDistanceFromRoute = (
  latitude,
  longitude,
  routeCoordinates
) => {
  if (
    !Array.isArray(routeCoordinates) ||
    routeCoordinates.length === 0
  ) {
    return null;
  }

  let minimumDistance = Infinity;

  for (const coordinate of routeCoordinates) {
    if (
      !Array.isArray(coordinate) ||
      coordinate.length < 2
    ) {
      continue;
    }

    const routeLongitude = coordinate[0];
    const routeLatitude = coordinate[1];

    const distance = calculateDistance(
      latitude,
      longitude,
      routeLatitude,
      routeLongitude
    );

    if (distance < minimumDistance) {
      minimumDistance = distance;
    }
  }

  return minimumDistance === Infinity
    ? null
    : minimumDistance;
};


/**
 * Determine whether a driver is off the planned route.
 *
 * thresholdMeters:
 * Maximum allowed distance from route
 * before the driver is considered off-route.
 */
export const checkIfOffRoute = (
  latitude,
  longitude,
  routeGeometry,
  thresholdMeters = 100
) => {
  if (
    !routeGeometry ||
    routeGeometry.type !== "LineString" ||
    !Array.isArray(routeGeometry.coordinates)
  ) {
    return {
      offRoute: false,
      distanceFromRoute: null,
      message: "Route geometry unavailable",
    };
  }

  const distanceFromRoute =
    calculateDistanceFromRoute(
      latitude,
      longitude,
      routeGeometry.coordinates
    );

  if (distanceFromRoute === null) {
    return {
      offRoute: false,
      distanceFromRoute: null,
      message: "Unable to calculate distance from route",
    };
  }

  const distanceFromRouteMeters =
    distanceFromRoute * 1000;

  const offRoute =
    distanceFromRouteMeters > thresholdMeters;

  return {
    offRoute,
    distanceFromRoute:
      Number(distanceFromRoute.toFixed(4)),
    distanceFromRouteMeters:
      Number(
        distanceFromRouteMeters.toFixed(2)
      ),
    thresholdMeters,
    message: offRoute
      ? "Driver is off the planned route"
      : "Driver is on the planned route",
  };
};


/**
 * Calculate route progress.
 *
 * Uses the driver's current GPS position
 * and the stored route geometry.
 *
 * Returns:
 * - distance travelled
 * - distance remaining
 * - progress percentage
 */
export const calculateRouteProgress = (
  latitude,
  longitude,
  routeGeometry,
  totalRouteDistance
) => {
  if (
    !routeGeometry ||
    routeGeometry.type !== "LineString" ||
    !Array.isArray(routeGeometry.coordinates) ||
    routeGeometry.coordinates.length === 0
  ) {
    return null;
  }

  if (
    !Number.isFinite(totalRouteDistance) ||
    totalRouteDistance <= 0
  ) {
    return null;
  }

  // ----------------------------------------
  // Find nearest point on stored route
  // ----------------------------------------

  let nearestIndex = 0;
  let minimumDistance = Infinity;

  routeGeometry.coordinates.forEach(
    (coordinate, index) => {
      if (
        !Array.isArray(coordinate) ||
        coordinate.length < 2
      ) {
        return;
      }

      const routeLongitude = coordinate[0];
      const routeLatitude = coordinate[1];

      const distance = calculateDistance(
        latitude,
        longitude,
        routeLatitude,
        routeLongitude
      );

      if (distance < minimumDistance) {
        minimumDistance = distance;
        nearestIndex = index;
      }
    }
  );

  // ----------------------------------------
  // Calculate distance travelled along route
  // ----------------------------------------

  let distanceTravelled = 0;

  for (
    let i = 1;
    i <= nearestIndex;
    i++
  ) {
    const previous =
      routeGeometry.coordinates[i - 1];

    const current =
      routeGeometry.coordinates[i];

    if (
      !previous ||
      !current ||
      previous.length < 2 ||
      current.length < 2
    ) {
      continue;
    }

    const segmentDistance =
      calculateDistance(
        previous[1],
        previous[0],
        current[1],
        current[0]
      );

    distanceTravelled += segmentDistance;
  }

  // ----------------------------------------
  // Prevent values exceeding route distance
  // ----------------------------------------

  distanceTravelled = Math.min(
    distanceTravelled,
    totalRouteDistance
  );

  const distanceRemaining =
    Math.max(
      totalRouteDistance -
        distanceTravelled,
      0
    );

  // ----------------------------------------
  // Calculate percentage
  // ----------------------------------------

  const progressPercentage =
    Math.min(
      (distanceTravelled /
        totalRouteDistance) *
        100,
      100
    );

  return {
    distanceTravelled: Number(
      distanceTravelled.toFixed(4)
    ),

    distanceTravelledMeters: Number(
      (distanceTravelled * 1000).toFixed(2)
    ),

    distanceRemaining: Number(
      distanceRemaining.toFixed(4)
    ),

    distanceRemainingMeters: Number(
      (distanceRemaining * 1000).toFixed(2)
    ),

    progressPercentage: Number(
      progressPercentage.toFixed(2)
    ),

    distanceFromRoute: Number(
      minimumDistance.toFixed(4)
    ),

    distanceFromRouteMeters: Number(
      (minimumDistance * 1000).toFixed(2)
    ),
  };
};