import React, { useMemo } from "react";
import { StyleProp, ViewStyle } from "react-native";
import { WebView } from "react-native-webview";

export interface MapCoordinate {
  latitude: number;
  longitude: number;
}

interface OpenStreetMapProps {
  pickup?: MapCoordinate | null;
  destination?: MapCoordinate | null;
  driver?: MapCoordinate | null;
  routeCoordinates?: MapCoordinate[];
  height?: number;
  style?: StyleProp<ViewStyle>;
}

const OpenStreetMap = ({
  pickup = null,
  destination = null,
  driver = null,
  routeCoordinates = [],
  height = 300,
  style,
}: OpenStreetMapProps) => {
  const mapData = useMemo(
    () => ({
      pickup,
      destination,
      driver,
      routeCoordinates,
    }),
    [pickup, destination, driver, routeCoordinates]
  );

  const html = useMemo(() => {
    const data = JSON.stringify(mapData).replace(/</g, "\\u003c");

    return `
<!DOCTYPE html>
<html lang="en">
<head>

<meta charset="UTF-8">

<meta
  name="viewport"
  content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
/>

<title>OpenStreetMap</title>

<link
  rel="stylesheet"
  href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
/>

<script
  src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js">
</script>

<style>

html,
body,
#map {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}

body {
  overflow: hidden;
}

.leaflet-control-attribution {
  font-size: 9px;
}

.marker {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: white;
  font-size: 18px;
  font-weight: bold;
  border: 3px solid white;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
}

.pickup {
  background: #16a34a;
  width: 38px;
  height: 38px;
}

.destination {
  background: #dc2626;
  width: 38px;
  height: 38px;
}

.driver {
  background: #2563eb;
  width: 48px;
  height: 48px;
}

</style>

</head>

<body>

<div id="map"></div>

<script>

const data = ${data};

const defaultLocation =
  data.driver ||
  data.pickup ||
  data.destination ||
  {
    latitude: 9.0820,
    longitude: 8.6753
  };

const map = L.map("map", {
  zoomControl: true,
  attributionControl: true
}).setView(
  [
    defaultLocation.latitude,
    defaultLocation.longitude
  ],
  13
);

L.tileLayer(
  "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  {
    maxZoom: 19,
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }
).addTo(map);

const bounds = [];

function addMarker(
  coordinate,
  title,
  description,
  className,
  icon
) {

  if (
    !coordinate ||
    coordinate.latitude == null ||
    coordinate.longitude == null
  ) {
    return;
  }

  const size =
    className === "driver" ? 48 : 38;

  const markerIcon = L.divIcon({
    className: "",
    html:
      '<div class="marker ' +
      className +
      '">' +
      icon +
      "</div>",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2]
  });

  const marker = L.marker(
    [
      coordinate.latitude,
      coordinate.longitude
    ],
    {
      icon: markerIcon
    }
  ).addTo(map);

  marker.bindPopup(
    "<strong>" +
    title +
    "</strong><br/>" +
    (description || "")
  );

  bounds.push([
    coordinate.latitude,
    coordinate.longitude
  ]);
}

addMarker(
  data.pickup,
  "Pickup",
  "Pickup location",
  "pickup",
  "📦"
);

addMarker(
  data.destination,
  "Destination",
  "Delivery destination",
  "destination",
  "🏁"
);

addMarker(
  data.driver,
  "Driver",
  "Current driver location",
  "driver",
  "🚚"
);

if (
  data.routeCoordinates &&
  data.routeCoordinates.length > 1
) {

  const route =
    data.routeCoordinates.map(
      coordinate => [
        coordinate.latitude,
        coordinate.longitude
      ]
    );

  L.polyline(
    route,
    {
      color: "#2563eb",
      weight: 5,
      opacity: 0.8
    }
  ).addTo(map);

  route.forEach(
    coordinate => {
      bounds.push(coordinate);
    }
  );
}

if (bounds.length > 1) {

  map.fitBounds(
    bounds,
    {
      padding: [40, 40]
    }
  );

} else if (bounds.length === 1) {

  map.setView(
    bounds[0],
    15
  );

}

setTimeout(() => {
  map.invalidateSize();
}, 300);

</script>

</body>
</html>
`;
  }, [mapData]);

  return (
    <WebView
      source={{ html }}
      style={[
  {
    width: "100%",
    height,
  },
  style,
]}
      javaScriptEnabled={true}
      domStorageEnabled={true}
      originWhitelist={["*"]}
      mixedContentMode="always"
      scrollEnabled={false}
      allowsInlineMediaPlayback={true}
    />
  );
};

export default OpenStreetMap;