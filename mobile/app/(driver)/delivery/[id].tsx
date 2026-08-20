import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

import {  useLocalSearchParams, useRouter,} from "expo-router";

import { useAppSelector, useAppDispatch } from "../../../hooks/redux";

import {  acceptDelivery,  startDelivery,  completeDelivery,  getDriverDeliveries,} from "../../../services/deliveryService";

import { acceptDriverDelivery, completeDriverDelivery, fetchDriverDeliveries, startDriverDelivery } from "../../../store/slices/deliverySlice";

const DeliveryDetails = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

const token = useAppSelector(
  (state) => state.auth.token
);

  // Get delivery ID from the URL
  const { id } = useLocalSearchParams<{
    id: string;
  }>();

  // Get all deliveries from Redux
  const {
  deliveries,
  accepting,
  starting,
  completing,
  error,
} = useAppSelector(  (state) => state.deliveries);

// Refresh when something changes

const handleRefresh = async () => {
  if (token) {
    await dispatch(
      fetchDriverDeliveries(token)
    );
  }
};

  // Find the specific delivery
  const delivery = deliveries.find(
    (item) => item._id === id
  );

  // ------------------------------------------------
  // Loading / Not Found
  // ------------------------------------------------

  if (!delivery) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-100 px-5">

        <ActivityIndicator
          size="large"
          color="#1d4ed8"
        />

        <Text className="mt-4 text-lg font-semibold text-slate-700">
          Delivery not found
        </Text>

        <Text className="mt-2 text-center text-slate-500">
          We could not find this delivery in your assigned deliveries.
        </Text>

        <Pressable
          onPress={() => router.back()}
          className="mt-6 rounded-xl bg-blue-700 px-8 py-4"
        >
          <Text className="font-bold text-white">
            GO BACK
          </Text>
        </Pressable>

      </View>
    );
  }


  const handleAccept = async () => {
  if (!token || !delivery) return;

  try {
    await dispatch(
      acceptDriverDelivery({
        id: delivery._id,
        token,
      })
    ).unwrap();
  } catch (error) {
    console.error(
      "Accept delivery failed:",
      error
    );
  }
};
const handleStart = async () => {
  if (!token || !delivery) return;

  try {
    await dispatch(
      startDriverDelivery({
        id: delivery._id,
        token,
      })
    ).unwrap();
  } catch (error) {
    console.error(
      "Start delivery failed:",
      error
    );
  }
};

const handleComplete = async () => {
  if (!token || !delivery) return;

  try {
    await dispatch(
      completeDriverDelivery({
        id: delivery._id,
        token,
      })
    ).unwrap();
  } catch (error) {
    console.error(
      "Complete delivery failed:",
      error
    );
  }
};
  // ------------------------------------------------
  // Main Screen
  // ------------------------------------------------

  return (
    <View className="flex-1 bg-slate-100">

      {/* ================================
          HEADER
      ================================= */}

      <View className="bg-blue-700 px-5 pb-6 pt-14">

        <Pressable
          onPress={() => router.back()}
        >
          <Text className="text-base font-semibold text-white">
            ← Back
          </Text>
        </Pressable>

        <Text className="mt-5 text-2xl font-bold text-white">
          Delivery Details
        </Text>

        <Text className="mt-1 text-blue-100">
          Delivery #{delivery._id.slice(-6).toUpperCase()}
        </Text>

      </View>

      {/* ================================
          CONTENT
      ================================= */}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          padding: 20,
          paddingBottom: 120,
        }}
      >

        {/* ================================
            STATUS
        ================================= */}

        <View className="rounded-2xl bg-white p-5">

          <View className="flex-row items-center justify-between">

            <Text className="text-lg font-bold text-slate-900">
              Delivery Status
            </Text>

            <View
              className={`rounded-full px-4 py-2 ${
                delivery.status === "pending"
                  ? "bg-orange-100"
                  : delivery.status === "assigned"
                    ? "bg-purple-100"
                    : delivery.status === "accepted"
                      ? "bg-blue-100"
                      : delivery.status === "in_transit"
                        ? "bg-blue-100"
                        : delivery.status === "delivered"
                          ? "bg-green-100"
                          : "bg-red-100"
              }`}
            >
              <Text
                className={`text-xs font-bold ${
                  delivery.status === "pending"
                    ? "text-orange-700"
                    : delivery.status === "assigned"
                      ? "text-purple-700"
                      : delivery.status === "accepted"
                        ? "text-blue-700"
                        : delivery.status === "in_transit"
                          ? "text-blue-700"
                          : delivery.status === "delivered"
                            ? "text-green-700"
                            : "text-red-700"
                }`}
              >
                {delivery.status === "in_transit"
                  ? "IN TRANSIT"
                  : delivery.status.toUpperCase()}
              </Text>
            </View>

          </View>

        </View>

        {/* ================================
            CUSTOMER
        ================================= */}

        <View className="mt-5 rounded-2xl bg-white p-5">

          <Text className="text-lg font-bold text-slate-900">
            Customer
          </Text>

          <View className="mt-4">

            <Text className="text-xs text-slate-400">
              Name
            </Text>

            <Text className="mt-1 text-base font-semibold text-slate-800">
              {delivery.customer.name}
            </Text>

          </View>

          <View className="mt-4">

            <Text className="text-xs text-slate-400">
              Phone
            </Text>

            <Text className="mt-1 text-base font-semibold text-slate-800">
              📞 {delivery.customer.phone}
            </Text>

          </View>

          <View className="mt-4">

            <Text className="text-xs text-slate-400">
              Email
            </Text>

            <Text className="mt-1 text-base text-slate-700">
              {delivery.customer.email}
            </Text>

          </View>

        </View>

        {/* ================================
            PICKUP LOCATION
        ================================= */}

        <View className="mt-5 rounded-2xl bg-white p-5">

          <Text className="text-lg font-bold text-slate-900">
            📦 Pickup Location
          </Text>

          <Text className="mt-4 text-base font-semibold text-slate-800">
            {delivery.pickupLocation.address}
          </Text>

          <View className="mt-4 flex-row gap-3">

            <View className="flex-1 rounded-xl bg-slate-50 p-3">

              <Text className="text-xs text-slate-400">
                Latitude
              </Text>

              <Text className="mt-1 text-sm font-semibold text-slate-700">
                {delivery.pickupLocation.latitude}
              </Text>

            </View>

            <View className="flex-1 rounded-xl bg-slate-50 p-3">

              <Text className="text-xs text-slate-400">
                Longitude
              </Text>

              <Text className="mt-1 text-sm font-semibold text-slate-700">
                {delivery.pickupLocation.longitude}
              </Text>

            </View>

          </View>

        </View>

        {/* ================================
            DELIVERY LOCATION
        ================================= */}

        <View className="mt-5 rounded-2xl bg-white p-5">

          <Text className="text-lg font-bold text-slate-900">
            🏁 Delivery Location
          </Text>

          <Text className="mt-4 text-base font-semibold text-slate-800">
            {delivery.deliveryLocation.address}
          </Text>

          <View className="mt-4 flex-row gap-3">

            <View className="flex-1 rounded-xl bg-slate-50 p-3">

              <Text className="text-xs text-slate-400">
                Latitude
              </Text>

              <Text className="mt-1 text-sm font-semibold text-slate-700">
                {delivery.deliveryLocation.latitude}
              </Text>

            </View>

            <View className="flex-1 rounded-xl bg-slate-50 p-3">

              <Text className="text-xs text-slate-400">
                Longitude
              </Text>

              <Text className="mt-1 text-sm font-semibold text-slate-700">
                {delivery.deliveryLocation.longitude}
              </Text>

            </View>

          </View>

        </View>

        {/* ================================
            PACKAGE
        ================================= */}

        <View className="mt-5 rounded-2xl bg-white p-5">

          <Text className="text-lg font-bold text-slate-900">
            📦 Package Information
          </Text>

          <View className="mt-4">

            <Text className="text-xs text-slate-400">
              Description
            </Text>

            <Text className="mt-1 text-base font-semibold text-slate-800">
              {delivery.packageDescription}
            </Text>

          </View>

          <View className="mt-4">

            <Text className="text-xs text-slate-400">
              Weight
            </Text>

            <Text className="mt-1 text-base font-semibold text-slate-800">
              {delivery.packageWeight} kg
            </Text>

          </View>

          {delivery.notes ? (
            <View className="mt-4 rounded-xl bg-yellow-50 p-4">

              <Text className="text-xs font-semibold text-yellow-700">
                NOTES
              </Text>

              <Text className="mt-1 text-sm text-yellow-800">
                {delivery.notes}
              </Text>

            </View>
          ) : null}

        </View>

        {/* ================================
            DISTANCE & TIME
        ================================= */}

        <View className="mt-5 flex-row gap-3">

          <View className="flex-1 rounded-2xl bg-white p-5">

            <Text className="text-xs text-slate-400">
              Distance
            </Text>

            <Text className="mt-2 text-xl font-bold text-slate-800">
              {delivery.distance.toFixed(2)} km
            </Text>

          </View>

          <View className="flex-1 rounded-2xl bg-white p-5">

            <Text className="text-xs text-slate-400">
              Estimated Time
            </Text>

            <Text className="mt-2 text-xl font-bold text-slate-800">
              {delivery.estimatedTime.toFixed(0)} min
            </Text>

          </View>

        </View>

        {/* ================================
            DRIVER LOCATION
        ================================= */}

        <View className="mt-5 rounded-2xl bg-white p-5">

          <Text className="text-lg font-bold text-slate-900">
            📍 Current Driver Location
          </Text>

          {delivery.currentLocation.latitude !== null &&
          delivery.currentLocation.longitude !== null ? (
            <>

              <Text className="mt-4 text-slate-700">
                Latitude: {delivery.currentLocation.latitude}
              </Text>

              <Text className="mt-1 text-slate-700">
                Longitude: {delivery.currentLocation.longitude}
              </Text>

              {delivery.currentLocation.updatedAt && (
                <Text className="mt-2 text-xs text-slate-400">
                  Updated:{" "}
                  {new Date(
                    delivery.currentLocation.updatedAt
                  ).toLocaleString()}
                </Text>
              )}

            </>
          ) : (
            <Text className="mt-4 text-slate-500">
              Driver location has not been updated yet.
            </Text>
          )}

        </View>

        {/* ================================
            TIMELINE
        ================================= */}

        <View className="mt-5 rounded-2xl bg-white p-5">

          <Text className="text-lg font-bold text-slate-900">
            Delivery Timeline
          </Text>

          {/* Assigned */}
          {delivery.assignedAt && (
            <View className="mt-5">

              <Text className="font-semibold text-slate-800">
                ✓ Assigned
              </Text>

              <Text className="mt-1 text-sm text-slate-500">
                {new Date(
                  delivery.assignedAt
                ).toLocaleString()}
              </Text>

            </View>
          )}

          {/* Accepted */}
          {delivery.acceptedAt && (
            <View className="mt-5">

              <Text className="font-semibold text-slate-800">
                ✓ Accepted
              </Text>

              <Text className="mt-1 text-sm text-slate-500">
                {new Date(
                  delivery.acceptedAt
                ).toLocaleString()}
              </Text>

            </View>
          )}

          {/* Started */}
          {delivery.startedAt && (
            <View className="mt-5">

              <Text className="font-semibold text-slate-800">
                ✓ Started
              </Text>

              <Text className="mt-1 text-sm text-slate-500">
                {new Date(
                  delivery.startedAt
                ).toLocaleString()}
              </Text>

            </View>
          )}

          {/* Delivered */}
          {delivery.deliveredAt && (
            <View className="mt-5">

              <Text className="font-semibold text-green-700">
                ✓ Delivered
              </Text>

              <Text className="mt-1 text-sm text-slate-500">
                {new Date(
                  delivery.deliveredAt
                ).toLocaleString()}
              </Text>

            </View>
          )}

          {/* Cancelled */}
          {delivery.cancelledAt && (
            <View className="mt-5">

              <Text className="font-semibold text-red-700">
                ✕ Cancelled
              </Text>

              <Text className="mt-1 text-sm text-slate-500">
                {new Date(
                  delivery.cancelledAt
                ).toLocaleString()}
              </Text>

            </View>
          )}

        </View>

        {/* ================================
    DELIVERY ACTION
================================= */}

<View className="mt-5 rounded-2xl bg-white p-5">

  <Text className="text-lg font-bold text-slate-900">
    Delivery Action
  </Text>

  {/* Error */}
  {error && (
    <View className="mt-4 rounded-xl bg-red-50 p-4">
      <Text className="font-semibold text-red-700">
        {error}
      </Text>
    </View>
  )}

  {/* ASSIGNED → ACCEPT */}
  {delivery.status === "assigned" && (
    <Pressable
      onPress={handleAccept}
      disabled={accepting}
      className={`mt-5 rounded-xl py-4 ${
        accepting
          ? "bg-blue-400"
          : "bg-blue-700"
      }`}
    >
      {accepting ? (
        <View className="flex-row items-center justify-center">
          <ActivityIndicator
            color="#ffffff"
          />

          <Text className="ml-2 font-bold text-white">
            ACCEPTING...
          </Text>
        </View>
      ) : (
        <Text className="text-center font-bold text-white">
          ACCEPT DELIVERY
        </Text>
      )}
    </Pressable>
  )}

  {/* ACCEPTED → START */}
  {delivery.status === "accepted" && (
    <Pressable
      onPress={handleStart}
      disabled={starting}
      className={`mt-5 rounded-xl py-4 ${
        starting
          ? "bg-blue-400"
          : "bg-blue-700"
      }`}
    >
      {starting ? (
        <View className="flex-row items-center justify-center">
          <ActivityIndicator
            color="#ffffff"
          />

          <Text className="ml-2 font-bold text-white">
            STARTING...
          </Text>
        </View>
      ) : (
        <Text className="text-center font-bold text-white">
          START DELIVERY
        </Text>
      )}
    </Pressable>
  )}

  {/* IN TRANSIT → COMPLETE */}
  {delivery.status === "in_transit" && (
    <Pressable
      onPress={handleComplete}
      disabled={completing}
      className={`mt-5 rounded-xl py-4 ${
        completing
          ? "bg-green-400"
          : "bg-green-600"
      }`}
    >
      {completing ? (
        <View className="flex-row items-center justify-center">
          <ActivityIndicator
            color="#ffffff"
          />

          <Text className="ml-2 font-bold text-white">
            COMPLETING...
          </Text>
        </View>
      ) : (
        <Text className="text-center font-bold text-white">
          COMPLETE DELIVERY
        </Text>
      )}
    </Pressable>
  )}

  {/* DELIVERED */}
  {delivery.status === "delivered" && (
    <View className="mt-5 rounded-xl bg-green-50 p-4">
      <Text className="text-center font-bold text-green-700">
        ✓ DELIVERY COMPLETED
      </Text>
    </View>
  )}

  {/* CANCELLED */}
  {delivery.status === "cancelled" && (
    <View className="mt-5 rounded-xl bg-red-50 p-4">
      <Text className="text-center font-bold text-red-700">
        ✕ DELIVERY CANCELLED
      </Text>
    </View>
  )}

</View>

      </ScrollView>
    </View>
  );
};

export default DeliveryDetails;