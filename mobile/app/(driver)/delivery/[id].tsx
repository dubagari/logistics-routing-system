import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  Alert,
  ScrollView,
  Linking,
} from "react-native";

import { useEffect, useState, useRef } from "react";
import * as Location from "expo-location";

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
} from "../../../hooks/redux";

import {
  fetchDriverDeliveries,
  acceptDriverDelivery,
  selectDriverDeliveryRoute,
  startDriverDelivery,
  completeDriverDelivery,
  updateDriverDeliveryLocation,
} from "../../../store/slices/deliverySlice";


const DeliveryDetails = () => {
  const router = useRouter();

  const { id } = useLocalSearchParams<{
    id: string;
  }>();

  const dispatch = useAppDispatch();

  const { token } = useAppSelector((state) => state.auth);
const {
  deliveries,
  loading,
  error,
  selectingRoute,
} = useAppSelector(
  (state) => state.deliveries
);
      
  const delivery = deliveries.find(
    (item) => item._id === id
  );

  const mapRef = useRef<MapView | null>(null);

  const [mapReady, setMapReady] = useState(false);

  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);


  // ============================================
  // FETCH DELIVERY
  // ============================================

  useEffect(() => {
    if (!token) return;

    dispatch(
      fetchDriverDeliveries(token)
    );
  }, [token, dispatch]);


  // ============================================
// DRIVER GPS TRACKING
// ============================================

useEffect(() => {
  if (
    !token ||
    !delivery ||
    delivery.status !== "in_transit"
  ) {
    return;
  }

  let locationSubscription: Location.LocationSubscription | null = null;

  const startLocationTracking = async () => {
    try {
      // ----------------------------------------
      // Request permission
      // ----------------------------------------

      const { status } =
        await Location.requestForegroundPermissionsAsync();

      if (status !== Location.PermissionStatus.GRANTED) {
        Alert.alert(
          "Location Permission",
          "Location permission is required to track the delivery."
        );

        return;
      }

      // ----------------------------------------
      // Watch driver location
      // ----------------------------------------

      locationSubscription =
        await Location.watchPositionAsync(
          {
            accuracy:
              Location.Accuracy.High,
            timeInterval: 5000,
            distanceInterval: 10,
          },

          async (location) => {
            const {
              latitude,
              longitude,
            } = location.coords;

            try {
              await dispatch(
                updateDriverDeliveryLocation({
                  id: delivery._id,
                  token,
                  latitude,
                  longitude,
                })
              ).unwrap();

            } catch (error) {
              console.error(
                "GPS UPDATE ERROR:",
                error
              );
            }
          }
        );

    } catch (error) {
      console.error(
        "LOCATION TRACKING ERROR:",
        error
      );
    }
  };

  startLocationTracking();

  // ----------------------------------------
  // Stop GPS tracking
  // ----------------------------------------

  return () => {
    if (locationSubscription) {
      locationSubscription.remove();
    }
  };

}, [
  token,
  delivery?._id,
  delivery?.status,
  dispatch,
]);

  // ============================================
  // ACCEPT DELIVERY
  // ============================================

  const handleAccept = async () => {
    if (!token || !delivery) return;

    try {
      await dispatch(
        acceptDriverDelivery({
          id: delivery._id,
          token,
        })
      ).unwrap();

      Alert.alert(
        "Success",
        "Delivery accepted successfully."
      );
    } catch (error) {
      Alert.alert(
        "Error",
        String(error)
      );
    }
  };


  // ============================================
  // COMPLETE DELIVERY
  // ============================================

  const handleComplete = async () => {
    if (!token || !delivery) return;

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
                "Success",
                "Delivery completed successfully."
              );
            } catch (error) {
              Alert.alert(
                "Error",
                String(error)
              );
            }
          },
        },
      ]
    );
  };

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
  // NOT FOUND
  // ============================================

  if (!delivery) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-100">

        <Text className="text-slate-500">
          Delivery not found.
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
  // DELIVERY DATA
  // ============================================

  const pickup =
    delivery.pickupLocation;

  const destination =
    delivery.deliveryLocation;

  const currentLocation =
    delivery.currentLocation;

  // ============================================
  // ROUTE
  // ============================================

  const selectedRoute =
  delivery.routes?.find(
    (route) =>
      route.id ===
      (selectedRouteId ||
        delivery.selectedRoute)
  );

const routeCoordinates =
  selectedRoute?.geometry?.coordinates?.map(
    (coord: number[]) => ({
      latitude: coord[1],
      longitude: coord[0],
    })
  ) || [];
    

  // ============================================
  // MAP POSITION
  // ============================================

  const mapLatitude =
    currentLocation?.latitude ??
    pickup.latitude;

  const mapLongitude =
    currentLocation?.longitude ??
    pickup.longitude;

    

  const distance =
    delivery.distance ?? 0;

  const estimatedTime =
    delivery.estimatedTime ?? 0;


    
  // ============================================
  // SCREEN
  // ============================================

  const handleSelectRoute = async (
  routeId: string
) => {
  if (!token || !delivery) return;

  try {
    await dispatch(
      selectDriverDeliveryRoute({
        id: delivery._id,
        token,
        routeId,
      })
    ).unwrap();

    setSelectedRouteId(routeId);

    Alert.alert(
      "Route Selected",
      "This route has been selected successfully."
    );
  } catch (error) {
    Alert.alert(
      "Error",
      String(error)
    );
  }
};

const startNavigation = async () => {
  if (!delivery.selectedRoute) {
    Alert.alert(
      "Route Not Selected",
      "Please select a route before starting navigation."
    );

    return;
  }

  const destinationCoords =
    `${destination.latitude},${destination.longitude}`;

  const googleMapsUrl =
    `https://www.google.com/maps/dir/?api=1` +
    `&destination=${encodeURIComponent(destinationCoords)}` +
    `&travelmode=driving`;

  try {
    const supported =
      await Linking.canOpenURL(
        googleMapsUrl
      );

    if (!supported) {
      Alert.alert(
        "Navigation Error",
        "Google Maps navigation is not available."
      );
      return;
    }

    await Linking.openURL(
      googleMapsUrl
    );
  } catch (error) {
    console.error(
      "NAVIGATION ERROR:",
      error
    );

    Alert.alert(
      "Navigation Error",
      "Unable to open navigation."
    );
  }
};

return (
  <View className="flex-1 bg-slate-100">

    {/* Header */}
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
        {delivery.status.toUpperCase()}
      </Text>
    </View>

    {/* MAP */}
    <View className="h-[30%]">


      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={{ flex: 1 }}
       initialRegion={{
  latitude: mapLatitude,
  longitude: mapLongitude,
  latitudeDelta: 0.08,
  longitudeDelta: 0.08,
}}
        onMapReady={() => setMapReady(true)}
        showsUserLocation={false}
        showsMyLocationButton={false}
        showsCompass
        loadingEnabled
      >

        <Marker
          coordinate={{
            latitude: pickup.latitude,
            longitude: pickup.longitude,
          }}
          title="Pickup"
          description={pickup.address}
        />

        <Marker
          coordinate={{
            latitude: destination.latitude,
            longitude: destination.longitude,
          }}
          title="Delivery Destination"
          description={destination.address}
        />

        {currentLocation?.latitude != null &&
          currentLocation?.longitude != null && (
            <Marker
              coordinate={{
                latitude: currentLocation.latitude,
                longitude: currentLocation.longitude,
              }}
              title="Driver"
              description="Current driver location"
            />
          )}

        {routeCoordinates.length > 1 && (
          <Polyline
            coordinates={routeCoordinates}
            strokeWidth={5}
          />
        )}

      </MapView>

      {!mapReady && (
        <View className="absolute inset-0 items-center justify-center bg-white/70">
          <ActivityIndicator
            size="large"
            color="#1d4ed8"
          />

          <Text className="mt-2 text-slate-600">
            Loading map...
          </Text>
        </View>
      )}

    </View>

    {/* DELIVERY DETAILS - SCROLLABLE */}
    <ScrollView
      className="flex-1 rounded-t-3xl bg-white"
      contentContainerStyle={{
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 40,
      }}
      showsVerticalScrollIndicator={true}
    >

      {/* PICKUP */}
      <Text className="text-xs font-semibold text-slate-400">
        PICKUP
      </Text>

      <Text className="mt-1 text-lg font-bold text-slate-900">
        {pickup.address}
      </Text>

      <Text className="my-2 text-slate-400">
        ↓
      </Text>

      {/* DESTINATION */}
      <Text className="text-xs font-semibold text-slate-400">
        DELIVERY
      </Text>

      <Text className="mt-1 text-lg font-bold text-slate-900">
        {destination.address}
      </Text>

 

      {/* INFORMATION */}
      <View className="mt-5 flex-row justify-between">

        <View>
          <Text className="text-xs text-slate-400">
            Distance
          </Text>

          <Text className="mt-1 font-bold text-slate-900">
            {distance.toFixed(2)} km
          </Text>
        </View>

        <View>
          <Text className="text-xs text-slate-400">
            Estimated Time
          </Text>

          <Text className="mt-1 font-bold text-slate-900">
            {estimatedTime.toFixed(0)} min
          </Text>
        </View>

        <View>
          <Text className="text-xs text-slate-400">
            Status
          </Text>

          <Text className="mt-1 font-bold text-green-600">
            {delivery.status}
          </Text>
        </View>

      </View>

      {/* ACTION BUTTONS */}

    {/* ACTION BUTTONS */}

{/* ASSIGNED */}

{delivery.status === "assigned" && (
  <Pressable
    className="mt-6 rounded-xl bg-blue-700 py-4"
    onPress={handleAccept}
  >
    <Text className="text-center font-bold text-white">
      ACCEPT DELIVERY
    </Text>
  </Pressable>
)}



{/* ACCEPTED */}

{delivery.status === "accepted" && (
  <View className="mt-6">

    <Text className="text-lg font-bold text-slate-900">
      Choose a Route
    </Text>

    <Text className="mt-1 text-sm text-slate-500">
      Select the route you want to use for this delivery.
    </Text>

    {/* CALCULATED ROUTES */}

    <View className="mt-4 gap-3">

      {delivery.routes?.map(
        (route, index) => {

          const isSelected =
            selectedRouteId === route.id ||
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
                  ? "border-green-600 bg-green-50"
                  : "border-slate-200 bg-white"
              }`}
            >

              <View className="flex-row items-center justify-between">

                <Text className="text-base font-bold text-slate-900">
                  Route {index + 1}
                </Text>

                {isSelected && (
                  <Text className="font-bold text-green-600">
                    ✓ Selected
                  </Text>
                )}

              </View>

              <View className="mt-3 flex-row justify-between">

                <View>
                  <Text className="text-xs text-slate-400">
                    DISTANCE
                  </Text>

                  <Text className="mt-1 text-base font-bold text-slate-900">
                    {route.distance.toFixed(2)} km
                  </Text>
                </View>

                <View>
                  <Text className="text-xs text-slate-400">
                    ESTIMATED TIME
                  </Text>

                  <Text className="mt-1 text-base font-bold text-slate-900">
                    {route.estimatedTime.toFixed(0)} min
                  </Text>
                </View>

              </View>

            </Pressable>
          );
        }
      )}

    </View>

    {/* SELECTING */}

    {selectingRoute && (
      <View className="mt-4 flex-row items-center justify-center">

        <ActivityIndicator
          size="small"
          color="#2563eb"
        />

        <Text className="ml-2 text-slate-500">
          Selecting route...
        </Text>

      </View>
    )}

    {/* START DELIVERY */}

    <Pressable
      disabled={
        !delivery.selectedRoute ||
        selectingRoute
      }
      onPress={async () => {

        if (
          !token ||
          !delivery.selectedRoute
        ) {
          Alert.alert(
            "Select Route",
            "Please select a route before starting the delivery."
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
            "Your delivery is now in transit."
          );

        } catch (error) {

          Alert.alert(
            "Error",
            String(error)
          );

        }
      }}
      className={`mt-5 rounded-xl py-4 ${
        delivery.selectedRoute
          ? "bg-green-600"
          : "bg-slate-300"
      }`}
    >

      <Text className="text-center font-bold text-white">
        START DELIVERY
      </Text>

    </Pressable>

  </View>
)}
{/* IN TRANSIT */}

{delivery.status === "in_transit" && (
  <>
    <Pressable
      className="mt-6 rounded-xl bg-blue-700 py-4"
      onPress={startNavigation}
    >
      <Text className="text-center font-bold text-white">
        🧭 START NAVIGATION
      </Text>
    </Pressable>

    <Pressable
      className="mt-3 rounded-xl bg-green-600 py-4"
      onPress={handleComplete}
    >
      <Text className="text-center font-bold text-white">
        COMPLETE DELIVERY
      </Text>
    </Pressable>
  </>
)}

{/* DELIVERED */}

{delivery.status === "delivered" && (
  <View className="mt-6 rounded-xl bg-green-50 p-4">
    <Text className="text-center font-bold text-green-700">
      ✓ DELIVERY COMPLETED
    </Text>
  </View>
)}
    </ScrollView>

  </View>
);
};

export default DeliveryDetails;