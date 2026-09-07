
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

import OpenStreetMap from "@/components/OpenStreetMap";

import {
  useLocalSearchParams,
  useRouter,
} from "expo-router";

import {
  useEffect,useMemo,useState
} from "react";

import {
  useAppDispatch,
  useAppSelector,
} from "../../hooks/redux";

import {
  getCustomerDeliveryByIdThunk,
} from "../../store/slices/deliverySlice";

const TrackDelivery = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [initialLoading, setInitialLoading] =
    useState(true);

  // const mapRef =    useRef<MapView | null>(null);
  const { id } =
    useLocalSearchParams<{ id: string }>();

  const { token } = useAppSelector(
    (state) => state.auth
  );

  const {
    deliveries,
    error,
  } = useAppSelector(
    (state) => state.deliveries
  );

  // ============================================
  // FIND DELIVERY IN REDUX
  // ============================================

  const delivery = deliveries.find(
    (item) => item._id === id
  );

  // ============================================
  // FETCH DELIVERY
  // ============================================

useEffect(() => {
  if (!token || !id) return;

  let interval: ReturnType<typeof setInterval> | null = null;

  const fetchDelivery = async () => {
    setInitialLoading(true);

    const result = await dispatch(
      getCustomerDeliveryByIdThunk({
        id,
        token,
      })
    );

    setInitialLoading(false);

    // Stop polling if delivery is finished
    if (
      getCustomerDeliveryByIdThunk.fulfilled.match(result) &&
      (result.payload.status === "delivered" ||
        result.payload.status === "cancelled")
    ) {
      return;
    }

    interval = setInterval(() => {
      dispatch(
        getCustomerDeliveryByIdThunk({
          id,
          token,
        })
      );
    }, 5000);
  };

  fetchDelivery();

  return () => {
    if (interval) {
      clearInterval(interval);
    }
  };
}, [id, token, dispatch]);

// ============================================
// ROUTE COORDINATES
// ============================================

const routeCoordinates = useMemo(() => {
  const selectedRoute =
    delivery?.routes?.find(
      (route) =>
        route.id === delivery?.selectedRoute
    );

  const coordinates =
    selectedRoute?.geometry?.coordinates;

  if (!coordinates || coordinates.length === 0) {
    return [];
  }

  return coordinates.map(
    ([longitude, latitude]) => ({
      latitude,
      longitude,
    })
  );
}, [
  delivery?.routes,
  delivery?.selectedRoute,
]);

// ============================================
// PICKUP
// ============================================

const pickupCoordinate = {
  latitude: delivery?.pickupLocation?.latitude || 0,
  longitude: delivery?.pickupLocation?.longitude || 0,
};

// ============================================
// DESTINATION
// ============================================

const destinationCoordinate = {
  latitude: delivery?.deliveryLocation?.latitude || 0,
  longitude: delivery?.deliveryLocation?.longitude || 0,
};

// ============================================
// DRIVER LOCATION
// ============================================

const driverCoordinate =
  delivery?.currentLocation?.latitude != null &&
  delivery?.currentLocation?.longitude != null
    ? {
        latitude: delivery.currentLocation.latitude,
        longitude: delivery.currentLocation.longitude,
      }
    : null;



  // ============================================
  // LOADING
  // ============================================
if (initialLoading) {
  return (
    <View className="flex-1 items-center justify-center bg-slate-100">

      <ActivityIndicator
        size="large"
        color="#1d4ed8"
      />

      <Text className="mt-3 text-slate-500">
        Loading delivery...
      </Text>

    </View>
  );
}

  // ============================================
  // DELIVERY NOT FOUND
  // ============================================

  if (!delivery) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-100 px-5">

        <Text className="text-xl font-bold text-slate-900">
          Delivery not found
        </Text>

        {error && (
          <Text className="mt-2 text-center text-sm text-red-500">
            {error}
          </Text>
        )}

        <Pressable
          onPress={() => router.back()}
          className="mt-5 rounded-xl bg-blue-700 px-6 py-3"
        >
          <Text className="font-bold text-white">
            Go Back
          </Text>
        </Pressable>

      </View>
    );
  }

  // ============================================
  // DELIVERY STATUS
  // ============================================

  const isPending =
    delivery.status === "pending";

  const isAssigned =
    delivery.status === "assigned";

  const isAccepted =
    delivery.status === "accepted";

  const isInTransit =
    delivery.status === "in_transit";

  const isDelivered =
    delivery.status === "delivered";

  // ============================================
  // PROGRESS
  // ============================================


const remainingDistance = Number(
  delivery.distance || 0
);

const remainingTime = Number(
  delivery.estimatedTime || 0
);

let progress = 0;

if (isDelivered) {
  progress = 100;
}
  return (
    <View className="flex-1 bg-slate-100">

      {/* ====================================== */}
      {/* HEADER */}
      {/* ====================================== */}

      <View className="bg-blue-700 px-5 pb-7 pt-14">

        <Pressable
          onPress={() => router.back()}
        >
          <Text className="font-semibold text-white">
            ← Back
          </Text>
        </Pressable>

        <Text className="mt-5 text-2xl font-bold text-white">
          Track Delivery
        </Text>

        <Text className="mt-1 text-blue-100">
          {delivery._id}
        </Text>

      </View>

      {/* ====================================== */}
      {/* CONTENT */}
      {/* ====================================== */}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          padding: 20,
          paddingBottom: 120,
        }}
      >

     {/* ==================================== */}
{/* MAP */}
{/* ==================================== */}

<View className="overflow-hidden rounded-2xl bg-white">
  <OpenStreetMap
    pickup={pickupCoordinate}
    destination={destinationCoordinate}
    driver={driverCoordinate}
    routeCoordinates={routeCoordinates}
    height={320}
  />

  {/* MAP STATUS */}

  <View className="absolute left-4 top-4 rounded-xl bg-white px-4 py-2 shadow">

    <Text className="text-xs font-semibold text-slate-400">
      LIVE STATUS
    </Text>

    <Text className="mt-1 font-bold text-blue-700">
      {delivery.status === "in_transit"
        ? "Driver is on the way"
        : delivery.status
            .replace("_", " ")
            .toUpperCase()}
    </Text>

  </View>
</View>

        {/* ==================================== */}
        {/* STATUS */}
        {/* ==================================== */}

        <View className="mt-5 rounded-2xl bg-white p-5">

          <View className="flex-row items-center justify-between">

            <View>

              <Text className="text-xs font-semibold text-slate-400">
                DELIVERY STATUS
              </Text>

              <Text
                className={`mt-1 text-xl font-bold ${
                  isPending
                    ? "text-orange-500"
                    : isAssigned
                      ? "text-purple-600"
                      : isAccepted
                        ? "text-blue-600"
                        : isInTransit
                          ? "text-blue-700"
                          : isDelivered
                            ? "text-green-600"
                            : "text-slate-600"
                }`}
              >
                {delivery.status
                  .replace("_", " ")
                  .toUpperCase()}
              </Text>

            </View>

            <View className="h-12 w-12 items-center justify-center rounded-full bg-blue-100">

              <Text className="text-xl">
                {isDelivered
                  ? "✓"
                  : "🚚"}
              </Text>

            </View>

          </View>

          <Text className="mt-3 text-sm text-slate-500">

            {isPending
              ? "Your delivery is waiting for a driver."
              : isAssigned
                ? "A driver has been assigned to your delivery."
                : isAccepted
                  ? "Your driver has accepted the delivery."
                  : isInTransit
                    ? "Your driver is currently on the way."
                    : isDelivered
                      ? "Your delivery has been completed."
                      : "Delivery status updated."}

          </Text>

        </View>

        {/* ==================================== */}
        {/* PROGRESS */}
        {/* ==================================== */}

        <View className="mt-5 rounded-2xl bg-white p-5">

          <View className="flex-row items-center justify-between">

            <Text className="text-lg font-bold text-slate-900">
              Delivery Progress
            </Text>

            <Text className="font-bold text-blue-700">
              {remainingDistance} km left
            </Text>

          </View>

          {/* PROGRESS BAR */}

          <View className="mt-5 h-3 overflow-hidden rounded-full bg-slate-200">

            <View
              className="h-full rounded-full bg-blue-700"
              style={{
                width: `${progress}%`,
              }}
            />

          </View>

          <View className="mt-3 flex-row justify-between">

            <Text className="text-xs text-slate-500">
              Pickup
            </Text>

            <Text className="text-xs text-slate-500">
              Delivery
            </Text>

          </View>

        </View>

        {/* ==================================== */}
        {/* ESTIMATED ARRIVAL */}
        {/* ==================================== */}

        <View className="mt-5 rounded-2xl bg-white p-5">

          <Text className="text-lg font-bold text-slate-900">
            Estimated Arrival
          </Text>

          <View className="mt-5 flex-row justify-between">

            <View>

              <Text className="text-xs text-slate-400">
                ESTIMATED TIME
              </Text>

              <Text className="mt-1 text-xl font-bold text-slate-800">
                {remainingTime} min
              </Text>

            </View>

            <View>

              <Text className="text-xs text-slate-400">
                DISTANCE
              </Text>

              <Text className="mt-1 text-xl font-bold text-slate-800">
                {remainingDistance} km
              </Text>

            </View>

          </View>

        </View>

        {/* ==================================== */}
        {/* ROUTE */}
        {/* ==================================== */}

        <View className="mt-5 rounded-2xl bg-white p-5">

          <Text className="text-lg font-bold text-slate-900">
            Delivery Route
          </Text>

          {/* PICKUP */}

          <View className="mt-5">

            <Text className="text-xs font-semibold text-slate-400">
              PICKUP
            </Text>

            <Text className="mt-2 text-base text-slate-800">
              📍 {delivery.pickupLocation.address}
            </Text>

          </View>

          {/* DESTINATION */}

          <View className="mt-5">

            <Text className="text-xs font-semibold text-slate-400">
              DESTINATION
            </Text>

            <Text className="mt-2 text-base text-slate-800">
              📍 {delivery.deliveryLocation.address}
            </Text>

          </View>

        </View>

        {/* ==================================== */}
        {/* DRIVER */}
        {/* ==================================== */}

        <View className="mt-5 rounded-2xl bg-white p-5">

          <Text className="text-lg font-bold text-slate-900">
            Driver Information
          </Text>

          {typeof delivery.driver === "object" && delivery.driver ? (
            <>
              <Text className="mt-5 text-base font-semibold text-slate-800">
                🚚{" "}
                {(delivery.driver as any).fullName ||
                  delivery.driver.name ||
                  "Driver"}
              </Text>

              {delivery.driver.phone && (
                <Text className="mt-2 text-slate-500">
                  📞 {delivery.driver.phone}
                </Text>
              )}
            </>
          ) : (
            <Text className="mt-5 text-slate-500">
              No driver assigned yet.
            </Text>
          )}

        </View>

        {/* ==================================== */}
        {/* DRIVER LOCATION */}
        {/* ==================================== */}

        {delivery.currentLocation?.latitude != null &&
          delivery.currentLocation?.longitude != null && (
            <View className="mt-5 rounded-2xl bg-white p-5">

              <Text className="text-lg font-bold text-slate-900">
                Driver Location
              </Text>

              <Text className="mt-4 text-slate-600">
                Latitude:{" "}
                {delivery.currentLocation.latitude}
              </Text>

              <Text className="mt-2 text-slate-600">
                Longitude:{" "}
                {delivery.currentLocation.longitude}
              </Text>

              {delivery.currentLocation.updatedAt && (
                <Text className="mt-2 text-xs text-slate-400">
                  Last updated:{" "}
                  {new Date(
                    delivery.currentLocation.updatedAt
                  ).toLocaleString()}
                </Text>
              )}

            </View>
          )}

        {/* ==================================== */}
        {/* BACK */}
        {/* ==================================== */}

        <Pressable
          onPress={() => router.back()}
          className="mt-5 rounded-xl bg-slate-800 py-4"
        >

          <Text className="text-center font-bold text-white">
            BACK TO ORDER
          </Text>

        </Pressable>

      </ScrollView>

    </View>
  );
};

export default TrackDelivery;

