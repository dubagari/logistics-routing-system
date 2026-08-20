import {
  Text,
  View,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from "react-native";

import { useRouter } from "expo-router";

import { useEffect, useCallback } from "react";

import { useAppSelector, useAppDispatch,} from "../../hooks/redux";

import { fetchDriverDeliveries, updateDriverDeliveryLocation} from "../../store/slices/deliverySlice";

import { useDriverLocation } from "../../hooks/useDriverLocation";

import * as Location from "expo-location";



const DriverDashboard = () => {
  const router = useRouter();

  const dispatch = useAppDispatch();

  const { token } = useAppSelector((state) => state.auth);

const {deliveries, loading,error,} = useAppSelector((state) => state.deliveries);

const totalDeliveries = deliveries.length;

  const activeDeliveries = deliveries.filter(
  (delivery) =>
    delivery.status === "pending" ||
    delivery.status === "assigned" ||
    delivery.status === "accepted" ||
    delivery.status === "in_transit"
).length;

  const completedDeliveries = deliveries.filter(
      (delivery) =>
        delivery.status === "delivered"
    ).length;


  const activeDelivery = deliveries.find(
  (delivery) =>
    delivery.status === "accepted" ||
    delivery.status === "in_transit"
);


console.log("ACTIVE DELIVERY:",  activeDelivery?._id,activeDelivery?.status);


  useEffect(() => {
    if (token) {
      dispatch(
        fetchDriverDeliveries(token)
      );
    }
  }, [token, dispatch]);

  useEffect(() => {

    if (!token || !activeDelivery) return;
    
    // Only track when delivery has actually started
    if (activeDelivery.status !== "in_transit") {
      return;
    }
    console.log("GPS TRACKING DELIVERY:",  activeDelivery._id);
    
  let subscription: Location.LocationSubscription | null = null;

  const startTracking = async () => {
    try {
      // Request permission
      const { status } =
        await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        console.log("GPS permission denied");
        return;
      }

      console.log("GPS permission granted");

      // Get initial location
      const location =
        await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

      console.log("INITIAL GPS:", location.coords);

      dispatch(
        updateDriverDeliveryLocation({
          id: activeDelivery._id,
          token,
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        })
      );

      // Continue watching location
      subscription =
        await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 10000,
            distanceInterval: 10,
          },
          (location) => {
            const {
              latitude,
              longitude,
            } = location.coords;

            console.log(
              "LIVE GPS:",
              latitude,
              longitude
            );

            dispatch(
              updateDriverDeliveryLocation({
                id: activeDelivery._id,
                token,
                latitude,
                longitude,
              })
            );
          }
        );
    } catch (error) {
      console.error(
        "GPS TRACKING ERROR:",
        error
      );
    }
  };

  startTracking();

  return () => {
    if (subscription) {
      subscription.remove();
      console.log("GPS tracking stopped");
    }
  };
}, [
  token,
  activeDelivery?._id,
  activeDelivery?.status,
  dispatch,
]);

  

  const handleLocationUpdate = useCallback(
  (
    deliveryId: string,
    latitude: number,
    longitude: number
  ) => {
    if (!token) {
      return;
    }

    dispatch(
      updateDriverDeliveryLocation({
        id: deliveryId,
        token,
        latitude,
        longitude,
      })
    );
  },
  [dispatch, token]
);

  useDriverLocation({
  enabled: Boolean(activeDelivery),
  deliveryId:activeDelivery?._id || null,
  token,
  onLocationUpdate:handleLocationUpdate,
});
  
  return (
    <View className="flex-1 bg-slate-100">
     
        {/* Header */}
        <View className="bg-blue-700 px-5 pb-10 pt-14">
          <Text className="text-2xl font-bold text-white">
            Good morning 👋
          </Text>

          <Text className="mt-1 text-2xl font-bold text-white">
            Driver Dashboard
          </Text>

          <Text className="mt-1 text-blue-100">
            Ready for today's deliveries?
          </Text>
        </View>

{loading && (
  <View className="items-center py-6">
    <ActivityIndicator
      size="large"
      color="#1d4ed8"
    />

    <Text className="mt-2 text-slate-500">
      Loading deliveries...
    </Text>
  </View>
)}
        {/* Scrollable Content */}
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingTop: 20,
        paddingBottom: 120,
      }}
    >

        {/* Statistics */}
        <View className="-mt-5 mx-5 flex-row gap-3">

          {/* Total */}
          <View className="flex-1 rounded-2xl bg-white p-4">
            <Text className="text-2xl font-bold text-slate-900">
              {totalDeliveries}
            </Text>

            <Text className="mt-1 text-sm text-slate-500">
              Total
            </Text>
          </View>

          {/* Pending */}
          <View className="flex-1 rounded-2xl bg-white p-4">
            <Text className="text-2xl font-bold text-orange-500">
              {activeDeliveries}
            </Text>

            <Text className="mt-1 text-sm text-slate-500">
              Active
            </Text>
          </View>

          {/* Done */}
          <View className="flex-1 rounded-2xl bg-white p-4">
            <Text className="text-2xl font-bold text-green-600">
              {completedDeliveries}
            </Text>

            <Text className="mt-1 text-sm text-slate-500">
              Done
            </Text>
          </View>

        </View>

        {/* View All Deliveries */}
        <Pressable
          onPress={() => router.push("/(driver)/deliveries")}
          className="mx-5 mt-5 rounded-xl bg-blue-700 py-4"
        >
          <Text className="text-center font-bold text-white">
            VIEW ALL DELIVERIES
          </Text>
        </Pressable>

        {/* Current Location */}
        <View className="mx-5 mt-6 rounded-2xl bg-white p-5">
          {/* {            activeDelivery?.currentLocation?.latitude != null &&
activeDelivery?.currentLocation?.longitude != null ? (
  <View className="mt-4 rounded-xl bg-green-50 p-4">
    <Text className="font-semibold text-green-700">
      GPS tracking active
    </Text>

    <Text className="mt-2 text-sm text-slate-600">
      Latitude:{" "}
      {activeDelivery.currentLocation.latitude.toFixed(6)}
    </Text>

    <Text className="mt-1 text-sm text-slate-600">
      Longitude:{" "}
      {activeDelivery.currentLocation.longitude.toFixed(6)}
    </Text>

    <Text className="mt-1 text-xs text-slate-400">
      Updated:{" "}
      {activeDelivery.currentLocation.updatedAt
        ? new Date(
            activeDelivery.currentLocation.updatedAt
          ).toLocaleTimeString()
        : "Unknown"}
    </Text>
  </View>
) : (
  <View className="mt-4 h-40 items-center justify-center rounded-xl bg-slate-200">
    <Text className="text-slate-500">
      Waiting for GPS location...
    </Text>
  </View>
)} */}

{activeDelivery?.currentLocation?.latitude != null &&
 activeDelivery?.currentLocation?.longitude != null ? (
  <View className="mt-4 rounded-xl bg-green-50 p-4">
    <Text className="font-semibold text-green-700">
      GPS tracking active
    </Text>

    <Text className="mt-2 text-sm text-slate-600">
      Latitude:{" "}
      {activeDelivery.currentLocation.latitude.toFixed(6)}
    </Text>

    <Text className="mt-1 text-sm text-slate-600">
      Longitude:{" "}
      {activeDelivery.currentLocation.longitude.toFixed(6)}
    </Text>

    <Text className="mt-1 text-xs text-slate-400">
      Updated:{" "}
      {activeDelivery.currentLocation.updatedAt
        ? new Date(
            activeDelivery.currentLocation.updatedAt
          ).toLocaleTimeString()
        : "Unknown"}
    </Text>
  </View>
) : (
  <View className="mt-4 h-40 items-center justify-center rounded-xl bg-slate-200">
    <Text className="text-slate-500">
      Waiting for GPS location...
    </Text>
  </View>
)}
        </View>

        {/* Route */}
        {/* Current Delivery */}
{deliveries.length > 0 && (
  <View className="mx-5 mt-5 rounded-2xl bg-white p-5">

    <Text className="text-lg font-bold text-slate-900">
      Current Delivery
    </Text>

    <View className="mt-4">
      <Text className="text-xs text-slate-400">
        Pickup
      </Text>

      <Text className="mt-1 font-semibold text-slate-800">
        {deliveries[0].pickupLocation.address}
      </Text>
    </View>

    <View className="mt-4">
      <Text className="text-xs text-slate-400">
        Delivery
      </Text>

      <Text className="mt-1 font-semibold text-slate-800">
        {deliveries[0].deliveryLocation.address}
      </Text>
    </View>

    <View className="mt-4 flex-row justify-between">

      <View>
        <Text className="text-xs text-slate-400">
          Distance
        </Text>

        <Text className="font-semibold text-slate-800">
          {deliveries[0].distance.toFixed(2)} km
        </Text>
      </View>

      <View>
        <Text className="text-xs text-slate-400">
          Estimated Time
        </Text>

        <Text className="font-semibold text-slate-800">
          {deliveries[0].estimatedTime.toFixed(0)} min
        </Text>
      </View>

    </View>

    <View className="mt-4 rounded-xl bg-orange-50 p-4">
      <Text className="font-bold text-orange-700">
        Status: {deliveries[0].status.toUpperCase()}
      </Text>
    </View>

    <Pressable
   onPress={() =>
              router.push({
                pathname: "/(driver)/delivery/[id]",
                params: {
                  id: deliveries[0]._id,
                },
              })
            }
  className="mt-5 rounded-xl bg-blue-700 py-4"
>
  <Text className="text-center font-bold text-white">
    VIEW DELIVERY
  </Text>
</Pressable>

  </View>
)}
{error && (
  <View className="mx-5 mt-5 rounded-xl bg-red-50 p-4">
    <Text className="font-semibold text-red-700">
      {error}
    </Text>
  </View>
)}
  
      </ScrollView>
    </View>
  );
};

export default DriverDashboard;