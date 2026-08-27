import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";

import { useEffect, useRef } from "react";
import {
  useLocalSearchParams,
  useRouter,
} from "expo-router";

import MapView, {
  Marker,
  Polyline,
  PROVIDER_GOOGLE,
} from "react-native-maps";

import {
  useAppSelector,
  useAppDispatch,
} from "../../hooks/redux";

import {
  fetchDriverDeliveries,
  acceptDriverDelivery,
  selectDriverDeliveryRoute,
  startDriverDelivery,
  completeDriverDelivery,
} from "../../store/slices/deliverySlice";

const DeliveryDetails = () => {
  const router = useRouter();

  const { id } = useLocalSearchParams<{    id: string;  }>();

  const dispatch = useAppDispatch();

  const { token } = useAppSelector(
    (state) => state.auth
  );

 const {
  deliveries,
  loading,
  error,
  accepting,
  selectingRoute,
  starting,
  completing,
} = useAppSelector(
  (state) => state.deliveries
);
  // ============================================
  // FIND DELIVERY
  // ============================================

  const delivery = deliveries.find(
    (item) => item._id === id
  );

  const mapRef = useRef<MapView | null>(null);

  // ============================================
  // FETCH DRIVER DELIVERIES
  // ============================================

  useEffect(() => {
    if (!token) return;

    dispatch(
      fetchDriverDeliveries(token)
    );
  }, [token, dispatch]);

  // ============================================
  // FOLLOW DRIVER LOCATION
  // ============================================

  useEffect(() => {
    if (!delivery) return;

    const latitude =
      delivery.currentLocation?.latitude;

    const longitude =
      delivery.currentLocation?.longitude;

    if (
      latitude == null ||
      longitude == null
    ) {
      return;
    }

    mapRef.current?.animateToRegion(
      {
        latitude,
        longitude,
        latitudeDelta: 0.025,
        longitudeDelta: 0.025,
      },
      700
    );
  }, [
    delivery?.currentLocation?.latitude,
    delivery?.currentLocation?.longitude,
  ]);

  // ============================================
  // LOADING
  // ============================================

  if (loading && !delivery) {
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
  // ERROR
  // ============================================

  if (error && !delivery) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-100 px-5">
        <Text className="text-center font-semibold text-red-600">
          {error}
        </Text>

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
  // DELIVERY NOT FOUND
  // ============================================

  if (!delivery) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-100 px-5">
        <Text className="text-center text-slate-500">
          Delivery not found.
        </Text>

        <Pressable
          onPress={() => {
            if (token) {
              dispatch(
                fetchDriverDeliveries(token)
              );
            }
          }}
          className="mt-5 rounded-xl bg-blue-700 px-6 py-3"
        >
          <Text className="font-bold text-white">
            Refresh
          </Text>
        </Pressable>
      </View>
    );
  }

  // ============================================
  // DELIVERY DATA
  // ============================================

  const pickup =
    delivery.pickupLocation;

  const destination =
    delivery.deliveryLocation;

  const currentLocation =
    delivery.currentLocation;

  // ============================================
  // CURRENT ROUTE
  // ============================================

 const selectedRoute =
  delivery.routes?.find(
    (route) =>
      route.id === delivery.selectedRoute
  );

const routeCoordinates =
  selectedRoute?.geometry?.coordinates?.map(
    ([longitude, latitude]) => ({
      latitude,
      longitude,
    })
  ) || [];

  // ============================================
  // MAP START LOCATION
  // ============================================

  const mapLatitude =
    currentLocation?.latitude ??
    pickup.latitude;

  const mapLongitude =
    currentLocation?.longitude ??
    pickup.longitude;

  // ============================================
  // ACCEPT
  // ============================================

  const handleAccept = async () => {
    if (!token) return;

    try {
      await dispatch(
        acceptDriverDelivery({
          id: delivery._id,
          token,
        })
      ).unwrap();

      Alert.alert(
        "Delivery Accepted",
        "You have accepted this delivery."
      );
    } catch (error: any) {
      Alert.alert(
        "Unable to Accept",
        error || "Failed to accept delivery."
      );
    }
  };

  // ============================================
  // START
  // ============================================

const handleSelectRoute = async (
  routeId: string
) => {
  if (!token) return;

  try {
    await dispatch(
      selectDriverDeliveryRoute({
        id: delivery._id,
        token,
        routeId,
      })
    ).unwrap();

    Alert.alert(
      "Route Selected",
      "This route has been selected successfully."
    );
  } catch (error: any) {
    Alert.alert(
      "Unable to Select Route",
      error || "Failed to select delivery route."
    );
  }
};



const handleStart = async () => {
  if (!token) return;

  if (!delivery.selectedRoute) {
    Alert.alert(
      "Select Route",
      "Please select a delivery route first."
    );

    return;
  }

  try {
    await dispatch(
      startDriverDelivery({
        id: delivery._id,
        token,
      })
    ).unwrap();

    Alert.alert(
      "Delivery Started",
      "The delivery is now in transit."
    );
  } catch (error: any) {
    Alert.alert(
      "Unable to Start",
      error || "Failed to start delivery."
    );
  }
};

  // ============================================
  // COMPLETE
  // ============================================

  const handleComplete = () => {
    if (!token) return;

    Alert.alert(
      "Complete Delivery",
      "Are you sure you have delivered the package?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Complete",
          onPress: async () => {
            try {
              await dispatch(
                completeDriverDelivery({
                  id: delivery._id,
                  token,
                })
              ).unwrap();

              Alert.alert(
                "Delivery Completed",
                "The delivery has been completed successfully."
              );

              router.back();
            } catch (error: any) {
              Alert.alert(
                "Unable to Complete",
                error ||
                  "Failed to complete delivery."
              );
            }
          },
        },
      ]
    );
  };

  // ============================================
  // STATUS BUTTON
  // ============================================

  const renderActionButton = () => {
    // ASSIGNED
    if (delivery.status === "assigned") {
      return (
        <Pressable
          disabled={accepting}
          onPress={handleAccept}
          className={`mt-5 rounded-xl py-4 ${
            accepting
              ? "bg-blue-300"
              : "bg-blue-700"
          }`}
        >
          {accepting ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-center font-bold text-white">
              ACCEPT DELIVERY
            </Text>
          )}
        </Pressable>
      );
    }

 // ACCEPTED
if (delivery.status === "accepted") {
  return (
    <View className="mt-5">

      <Text className="text-lg font-bold text-slate-900">
        Choose a Route
      </Text>

      <Text className="mt-1 text-sm text-slate-500">
        Select the route you want to use for this delivery.
      </Text>

      {/* CALCULATED ROUTES */}

      <View className="mt-4 gap-3">

        {delivery.routes?.map((route, index) => {
          const isSelected =
            delivery.selectedRoute === route.id;

          return (
            <Pressable
              key={route.id}
              disabled={selectingRoute}
              onPress={() =>
                handleSelectRoute(route.id)
              }
              className={`rounded-xl border-2 p-4 ${
                isSelected
                  ? "border-blue-700 bg-blue-50"
                  : "border-slate-200 bg-white"
              }`}
            >

              <View className="flex-row items-center justify-between">

                <Text className="text-base font-bold text-slate-900">
                  Route {index + 1}
                </Text>

                {isSelected && (
                  <Text className="font-bold text-blue-700">
                    ✓ Selected
                  </Text>
                )}

              </View>

              <View className="mt-3 flex-row justify-between">

                <View>
                  <Text className="text-xs text-slate-400">
                    DISTANCE
                  </Text>

                  <Text className="mt-1 font-bold text-slate-900">
                    {route.distance.toFixed(2)} km
                  </Text>
                </View>

                <View>
                  <Text className="text-xs text-slate-400">
                    ESTIMATED TIME
                  </Text>

                  <Text className="mt-1 font-bold text-slate-900">
                    {route.estimatedTime.toFixed(0)} min
                  </Text>
                </View>

              </View>

            </Pressable>
          );
        })}

      </View>

      {/* START DELIVERY */}

      <Pressable
        disabled={
          starting ||
          selectingRoute ||
          !delivery.selectedRoute
        }
        onPress={handleStart}
        className={`mt-5 rounded-xl py-4 ${
          starting ||
          selectingRoute ||
          !delivery.selectedRoute
            ? "bg-slate-300"
            : "bg-green-600"
        }`}
      >

        {starting ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-center font-bold text-white">
            START DELIVERY
          </Text>
        )}

      </Pressable>

    </View>
  );
}

    // IN TRANSIT
    if (delivery.status === "in_transit") {
      return (
        <Pressable
          disabled={completing}
          onPress={handleComplete}
          className={`mt-5 rounded-xl py-4 ${
            completing
              ? "bg-orange-300"
              : "bg-orange-600"
          }`}
        >
          {completing ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-center font-bold text-white">
              COMPLETE DELIVERY
            </Text>
          )}
        </Pressable>
      );
    }

    // DELIVERED
    if (delivery.status === "delivered") {
      return (
        <View className="mt-5 rounded-xl bg-green-100 py-4">
          <Text className="text-center font-bold text-green-700">
            ✓ DELIVERY COMPLETED
          </Text>
        </View>
      );
    }

    // CANCELLED
    if (delivery.status === "cancelled") {
      return (
        <View className="mt-5 rounded-xl bg-red-100 py-4">
          <Text className="text-center font-bold text-red-700">
            DELIVERY CANCELLED
          </Text>
        </View>
      );
    }

    return null;
  };

  // ============================================
  // SCREEN
  // ============================================

  return (
    <View className="flex-1 bg-slate-100">

      {/* ======================================
          HEADER
      ====================================== */}

      <View className="bg-blue-700 px-5 pb-5 pt-14">

        <Pressable
          onPress={() => router.back()}
          className="mb-3"
        >
          <Text className="text-base font-semibold text-white">
            ← Back
          </Text>
        </Pressable>

        <Text className="text-2xl font-bold text-white">
          Delivery Details
        </Text>

        <Text className="mt-1 text-blue-100">
          {delivery.status
            .replace("_", " ")
            .toUpperCase()}
        </Text>

      </View>

      {/* ======================================
          MAP
          NOT FULL SCREEN
      ====================================== */}

      <View className="h-[42%] overflow-hidden">

        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          style={{
            flex: 1,
          }}
          initialRegion={{
            latitude: mapLatitude,
            longitude: mapLongitude,
            latitudeDelta: 0.06,
            longitudeDelta: 0.06,
          }}
          showsUserLocation={false}
          showsMyLocationButton={false}
          showsCompass
          loadingEnabled
        >

          {/* PICKUP */}

          <Marker
            coordinate={{
              latitude:
                pickup.latitude,
              longitude:
                pickup.longitude,
            }}
            title="Pickup"
            description={
              pickup.address
            }
          />

          {/* DESTINATION */}

          <Marker
            coordinate={{
              latitude:
                destination.latitude,
              longitude:
                destination.longitude,
            }}
            title="Delivery Destination"
            description={
              destination.address
            }
          />

          {/* DRIVER */}

          {currentLocation?.latitude != null &&
            currentLocation?.longitude != null && (
              <Marker
                coordinate={{
                  latitude:
                    currentLocation.latitude,
                  longitude:
                    currentLocation.longitude,
                }}
                title="Driver"
                description="Current driver location"
              />
            )}

          {/* CURRENT ROUTE */}

          {routeCoordinates.length > 1 && (
            <Polyline
              coordinates={
                routeCoordinates
              }
              strokeWidth={5}
            />
          )}

        </MapView>

      </View>

      {/* ======================================
          INFORMATION
      ====================================== */}

      <ScrollView
        className="flex-1 rounded-t-3xl bg-white"
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 20,
          paddingBottom: 40,
        }}
        showsVerticalScrollIndicator={false}
      >

        {/* PICKUP */}

        <Text className="text-xs font-semibold uppercase text-slate-400">
          Pickup
        </Text>

        <Text className="mt-1 text-base font-bold text-slate-900">
          {pickup.address}
        </Text>

        {/* ARROW */}

        <Text className="my-2 text-lg text-blue-600">
          ↓
        </Text>

        {/* DESTINATION */}

        <Text className="text-xs font-semibold uppercase text-slate-400">
          Delivery
        </Text>

        <Text className="mt-1 text-base font-bold text-slate-900">
          {destination.address}
        </Text>

        {/* ==================================
            STATS
        ================================== */}

        <View className="mt-5 flex-row justify-between">

          <View className="flex-1">

            <Text className="text-xs text-slate-400">
              Distance
            </Text>

            <Text className="mt-1 font-bold text-slate-900">
              {delivery.distance.toFixed(2)} km
            </Text>

          </View>

          <View className="flex-1">

            <Text className="text-xs text-slate-400">
              Estimated Time
            </Text>

            <Text className="mt-1 font-bold text-slate-900">
              {delivery.estimatedTime.toFixed(0)} min
            </Text>

          </View>

          <View className="flex-1">

            <Text className="text-xs text-slate-400">
              Status
            </Text>

            <Text className="mt-1 font-bold text-blue-700">
              {delivery.status
                .replace("_", " ")}
            </Text>

          </View>

        </View>

        {/* ==================================
            PACKAGE
        ================================== */}

        <View className="mt-5 rounded-xl bg-slate-50 p-4">

          <Text className="text-xs font-semibold uppercase text-slate-400">
            Package
          </Text>

          <Text className="mt-1 font-semibold text-slate-900">
            {delivery.packageDescription}
          </Text>

          {delivery.packageWeight > 0 && (
            <Text className="mt-1 text-sm text-slate-500">
              Weight: {delivery.packageWeight} kg
            </Text>
          )}

          {delivery.notes ? (
            <Text className="mt-2 text-sm text-slate-500">
              Notes: {delivery.notes}
            </Text>
          ) : null}

        </View>

        {/* ==================================
            ACTION
        ================================== */}

        {renderActionButton()}

      </ScrollView>

    </View>
  );
};

export default DeliveryDetails;