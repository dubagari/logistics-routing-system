import { useEffect, useMemo, useState } from "react";
import {
  MapPin,
  Package,
  RefreshCw,
  Search,
  Truck,
} from "lucide-react";

import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";

import L from "leaflet";



import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { fetchAllDeliveries } from "../../redux/slices/deliverySlice";
import type { Delivery } from "../../types/Delivery";

const Tracking = () => {
  const dispatch = useAppDispatch();

  const { deliveries, loading, error } = useAppSelector(
    (state) => state.deliveries
  );

  const { token } = useAppSelector((state) => state.auth);

  const [search, setSearch] = useState("");
  const [selectedDeliveryId, setSelectedDeliveryId] =
    useState<string | null>(null);

  useEffect(() => {
    if (token) {
      dispatch(fetchAllDeliveries({ token }));
    }
  }, [dispatch, token]);

  const activeDeliveries = useMemo(() => {
    return deliveries.filter(
      (delivery) =>
        delivery.status !== "delivered" &&
        delivery.status !== "cancelled"
    );
  }, [deliveries]);

  const filteredDeliveries = useMemo(() => {
    const query = search.toLowerCase().trim();

    if (!query) return activeDeliveries;

    return activeDeliveries.filter((delivery) =>
      [
        delivery.customer?.name,
        delivery.customer?.email,
        delivery.driver?.name,
        delivery.pickupLocation?.address,
        delivery.deliveryLocation?.address,
        delivery.status,
      ]
        .filter(Boolean)
        .some((value) =>
          value!.toLowerCase().includes(query)
        )
    );
  }, [activeDeliveries, search]);

  const selectedDelivery: Delivery | null =
    activeDeliveries.find(
      (delivery) => delivery._id === selectedDeliveryId
    ) || filteredDeliveries[0] || null;

  const handleRefresh = () => {
    if (token) {
      dispatch(fetchAllDeliveries({ token }));
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "Pending";
      case "assigned":
        return "Assigned";
      case "accepted":
        return "Accepted";
      case "in_transit":
        return "In Transit";
      default:
        return status;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-amber-50 text-amber-700";
      case "assigned":
        return "bg-blue-50 text-blue-700";
      case "accepted":
        return "bg-purple-50 text-purple-700";
      case "in_transit":
        return "bg-emerald-50 text-emerald-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const pickupIcon = new L.Icon({
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const destinationIcon = new L.Icon({
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const driverIcon = new L.DivIcon({
  className: "",
  html: `
    <div style="
      width: 42px;
      height: 42px;
      border-radius: 50%;
      background: #2563eb;
      border: 4px solid white;
      box-shadow: 0 3px 10px rgba(0,0,0,.3);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 20px;
    ">
      🚚
    </div>
  `,
  iconSize: [42, 42],
  iconAnchor: [21, 21],
});

const MapController = ({
  center,
}: {
  center: [number, number];
}) => {
  const map = useMap();

  useEffect(() => {
    map.setView(center, 13);
  }, [map, center]);

  return null;
};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Live Tracking
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Monitor active deliveries and driver locations.
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-60"
        >
          <RefreshCw
            size={16}
            className={loading ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      {/* Search */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="relative max-w-lg">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search customer, driver, location..."
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Main Tracking Area */}
      <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
        {/* Delivery List */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-slate-900">
                Active Deliveries
              </h2>

              <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                {activeDeliveries.length}
              </span>
            </div>
          </div>

          <div className="max-h-[600px] overflow-y-auto">
            {loading ? (
              <div className="px-5 py-10 text-center text-sm text-slate-500">
                Loading deliveries...
              </div>
            ) : filteredDeliveries.length === 0 ? (
              <div className="px-5 py-10 text-center text-sm text-slate-500">
                No active deliveries found.
              </div>
            ) : (
              filteredDeliveries.map((delivery) => (
                <button
                  key={delivery._id}
                  onClick={() =>
                    setSelectedDeliveryId(delivery._id)
                  }
                  className={`w-full border-b border-slate-100 p-5 text-left transition hover:bg-slate-50 ${
                    selectedDelivery?._id === delivery._id
                      ? "bg-blue-50"
                      : ""
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-900">
                        {delivery.customer?.name ||
                          "Unknown customer"}
                      </p>

                      <p className="mt-1 truncate text-xs text-slate-500">
                        {delivery._id}
                      </p>
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-2 py-1 text-[11px] font-semibold ${getStatusClass(
                        delivery.status
                      )}`}
                    >
                      {getStatusLabel(delivery.status)}
                    </span>
                  </div>

                  <div className="mt-4 space-y-2">
                    <div className="flex gap-2">
                      <MapPin
                        size={15}
                        className="mt-0.5 shrink-0 text-blue-500"
                      />

                      <p className="truncate text-xs text-slate-600">
                        {delivery.pickupLocation.address}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <MapPin
                        size={15}
                        className="mt-0.5 shrink-0 text-red-500"
                      />

                      <p className="truncate text-xs text-slate-600">
                        {delivery.deliveryLocation.address}
                      </p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Tracking Details */}
        <div className="space-y-6">
          {!selectedDelivery ? (
            <div className="flex min-h-[500px] items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="text-center">
                <Package
                  size={42}
                  className="mx-auto text-slate-300"
                />

                <h3 className="mt-4 font-semibold text-slate-900">
                  Select a delivery
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Select an active delivery to view tracking
                  information.
                </p>
              </div>
            </div>
          ) : (
            <>
             {/* Live Map */}
<div className="h-[500px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
  {selectedDelivery ? (
    <MapContainer
      center={[
        selectedDelivery.currentLocation?.latitude ??
          selectedDelivery.pickupLocation.latitude,
        selectedDelivery.currentLocation?.longitude ??
          selectedDelivery.pickupLocation.longitude,
      ]}
      zoom={13}
      scrollWheelZoom={true}
      className="h-full w-full"
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MapController
        center={[
          selectedDelivery.currentLocation?.latitude ??
            selectedDelivery.pickupLocation.latitude,
          selectedDelivery.currentLocation?.longitude ??
            selectedDelivery.pickupLocation.longitude,
        ]}
      />

      {/* Pickup */}
      <Marker
        position={[
          selectedDelivery.pickupLocation.latitude,
          selectedDelivery.pickupLocation.longitude,
        ]}
        icon={pickupIcon}
      >
        <Popup>
          <strong>Pickup</strong>
          <br />
          {selectedDelivery.pickupLocation.address}
        </Popup>
      </Marker>

      {/* Destination */}
      <Marker
        position={[
          selectedDelivery.deliveryLocation.latitude,
          selectedDelivery.deliveryLocation.longitude,
        ]}
        icon={destinationIcon}
      >
        <Popup>
          <strong>Destination</strong>
          <br />
          {selectedDelivery.deliveryLocation.address}
        </Popup>
      </Marker>

      {/* Driver */}
      {selectedDelivery.currentLocation?.latitude != null &&
        selectedDelivery.currentLocation?.longitude !=
          null && (
          <Marker
            position={[
              selectedDelivery.currentLocation.latitude,
              selectedDelivery.currentLocation.longitude,
            ]}
            icon={driverIcon}
          >
            <Popup>
              <strong>
                {selectedDelivery.driver?.name ||
                  "Driver"}
              </strong>
              <br />
              Current location
            </Popup>
          </Marker>
        )}

      {/* Selected Route */}
      {selectedDelivery.routes &&
        selectedDelivery.selectedRoute &&
        (() => {
          const route = selectedDelivery.routes.find(
            (item) =>
              item.id === selectedDelivery.selectedRoute
          );

          if (!route) return null;

          const coordinates = route.geometry.coordinates.map(
            ([longitude, latitude]) =>
              [latitude, longitude] as [number, number]
          );

          return (
            <Polyline
              positions={coordinates}
              pathOptions={{
                weight: 5,
                opacity: 0.8,
              }}
            />
          );
        })()}
    </MapContainer>
  ) : (
    <div className="flex h-full items-center justify-center text-sm text-slate-500">
      No delivery selected
    </div>
  )}
</div>

              {/* Delivery Information */}
              <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 px-6 py-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                        Delivery
                      </p>

                      <h2 className="mt-1 font-semibold text-slate-900">
                        {selectedDelivery._id}
                      </h2>
                    </div>

                    <span
                      className={`w-fit rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusClass(
                        selectedDelivery.status
                      )}`}
                    >
                      {getStatusLabel(
                        selectedDelivery.status
                      )}
                    </span>
                  </div>
                </div>

                <div className="grid gap-6 p-6 md:grid-cols-2">
                  {/* Driver */}
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Driver
                    </p>

                    <div className="mt-3 flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                        <Truck size={20} />
                      </div>

                      <div>
                        <p className="font-semibold text-slate-900">
                          {selectedDelivery.driver?.name ||
                            "Not assigned"}
                        </p>

                        <p className="text-sm text-slate-500">
                          {selectedDelivery.driver?.phone ||
                            selectedDelivery.driver?.email ||
                            "No driver information"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Customer */}
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Customer
                    </p>

                    <div className="mt-3">
                      <p className="font-semibold text-slate-900">
                        {selectedDelivery.customer?.name}
                      </p>

                      <p className="text-sm text-slate-500">
                        {selectedDelivery.customer?.email}
                      </p>
                    </div>
                  </div>

                  {/* Pickup */}
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Pickup Location
                    </p>

                    <div className="mt-3 flex gap-3">
                      <MapPin
                        size={19}
                        className="mt-0.5 shrink-0 text-blue-600"
                      />

                      <p className="text-sm text-slate-700">
                        {selectedDelivery.pickupLocation.address}
                      </p>
                    </div>
                  </div>

                  {/* Destination */}
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Destination
                    </p>

                    <div className="mt-3 flex gap-3">
                      <MapPin
                        size={19}
                        className="mt-0.5 shrink-0 text-red-600"
                      />

                      <p className="text-sm text-slate-700">
                        {selectedDelivery.deliveryLocation.address}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 border-t border-slate-200 md:grid-cols-3">
                  <div className="border-r border-slate-200 p-5">
                    <p className="text-xs text-slate-400">
                      Distance
                    </p>

                    <p className="mt-1 font-semibold text-slate-900">
                      {selectedDelivery.distance
                        ? `${selectedDelivery.distance} km`
                        : "—"}
                    </p>
                  </div>

                  <div className="border-r border-slate-200 p-5">
                    <p className="text-xs text-slate-400">
                      Estimated Time
                    </p>

                    <p className="mt-1 font-semibold text-slate-900">
                      {selectedDelivery.estimatedTime
                        ? `${selectedDelivery.estimatedTime} min`
                        : "—"}
                    </p>
                  </div>

                  <div className="p-5">
                    <p className="text-xs text-slate-400">
                      Last Updated
                    </p>

                    <p className="mt-1 font-semibold text-slate-900">
                      {new Date(
                        selectedDelivery.updatedAt
                      ).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tracking;