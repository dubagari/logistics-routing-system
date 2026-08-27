const VALHALLA_BASE_URL = "https://valhalla1.openstreetmap.de/route";



/**
 * Decode Valhalla's encoded polyline
 * Returns GeoJSON coordinates: [longitude, latitude]
 */
const decodePolyline = (encoded) => {
  const coordinates = [];

  let index = 0;
  let latitude = 0;
  let longitude = 0;

  while (index < encoded.length) {
    let shift = 0;
    let result = 0;
    let byte;

    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);

    const deltaLatitude =
      result & 1 ? ~(result >> 1) : result >> 1;

    latitude += deltaLatitude;

    shift = 0;
    result = 0;

    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);

    const deltaLongitude =
      result & 1 ? ~(result >> 1) : result >> 1;

    longitude += deltaLongitude;

    coordinates.push([
      longitude / 1e6,
      latitude / 1e6,
    ]);
  }

  return coordinates;
};

export const getRoadRoute = async (
  pickupLatitude,
  pickupLongitude,
  deliveryLatitude,
  deliveryLongitude
) => {
  const requestBody = {
    locations: [
      {
        lat: pickupLatitude,
        lon: pickupLongitude,
      },
      {
        lat: deliveryLatitude,
        lon: deliveryLongitude,
      },
    ],
    costing: "auto",
    units: "kilometers",
    language: "en-US",
    alternates: 2,
  };

  const response = await fetch(VALHALLA_BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    throw new Error(
      `Routing request failed: ${response.status}`
    );
  }

  const data = await response.json();

  if (!data.trip) {
    throw new Error(
      "No delivery route could be calculated"
    );
  }

  const trips = [
    data.trip,
    ...(data.alternates || []).map(
      (alternate) => alternate.trip
    ),
  ];

  return trips.map((trip, index) => ({
    id: `route-${index + 1}`,

    distance: trip.summary.length,

    estimatedTime: trip.summary.time / 60,

    geometry: {
      type: "LineString",
      coordinates: decodePolyline(
        trip.legs[0].shape
      ),
    },
  }));
};

