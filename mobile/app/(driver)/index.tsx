import {
  View,
  Text,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from "react-native";

import { useEffect } from "react";
import { useRouter } from "expo-router";

import {
  useAppSelector,
  useAppDispatch,
} from "../../hooks/redux";

import {
  fetchDriverDeliveries,
} from "../../store/slices/deliverySlice";

const DriverHome = () => {
  const router = useRouter();

  const dispatch = useAppDispatch();

  const { token } = useAppSelector(
    (state) => state.auth
  );

  const {
    deliveries,
    loading,
    error,
  } = useAppSelector(
    (state) => state.deliveries
  );

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
  // STATISTICS
  // ============================================

  const totalDeliveries =
    deliveries.length;

  const assignedDeliveries =
    deliveries.filter(
      (delivery) =>
        delivery.status === "assigned"
    ).length;

  const activeDeliveries =
    deliveries.filter(
      (delivery) =>
        delivery.status === "accepted" ||
        delivery.status === "in_transit"
    ).length;

  const activeDelivery =
    deliveries.find(
      (delivery) =>
        delivery.status === "accepted" ||
        delivery.status === "in_transit"
    );  

  const completedDeliveries =
    deliveries.filter(
      (delivery) =>
        delivery.status === "delivered"
    ).length;

  // ============================================
  // LOADING
  // ============================================

  if (loading && deliveries.length === 0) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-100">

        <ActivityIndicator
          size="large"
          color="#1d4ed8"
        />

        <Text className="mt-3 text-slate-500">
          Loading dashboard...
        </Text>

      </View>
    );
  }

  // ============================================
  // DASHBOARD
  // ============================================

  return (
    <View className="flex-1 bg-slate-100">

      {/* ====================================== */}
      {/* HEADER */}
      {/* ====================================== */}

      <View className="bg-blue-700 px-5 pb-10 pt-14">

        <Text className="text-2xl font-bold text-white">
          Driver Dashboard
        </Text>

        <Text className="mt-1 text-blue-100">
          Welcome back, Driver 👋
        </Text>

      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: 20,
          paddingBottom: 120,
        }}
      >

        {/* ====================================== */}
        {/* STATISTICS */}
        {/* ====================================== */}

        <View className="mx-5 flex-row gap-3">

          {/* Total */}

          <View className="flex-1 rounded-2xl bg-white p-4">

            <Text className="text-2xl font-bold text-slate-900">
              {totalDeliveries}
            </Text>

            <Text className="mt-1 text-sm text-slate-500">
              Total
            </Text>

          </View>

          {/* Assigned */}

          <View className="flex-1 rounded-2xl bg-white p-4">

            <Text className="text-2xl font-bold text-orange-500">
              {assignedDeliveries}
            </Text>

            <Text className="mt-1 text-sm text-slate-500">
              Assigned
            </Text>

          </View>

        </View>

        <View className="mx-5 mt-3 flex-row gap-3">

          {/* Active */}

          <View className="flex-1 rounded-2xl bg-white p-4">

            <Text className="text-2xl font-bold text-blue-600">
              {activeDeliveries}
            </Text>

            <Text className="mt-1 text-sm text-slate-500">
              Active
            </Text>

          </View>

          {/* Completed */}

          <View className="flex-1 rounded-2xl bg-white p-4">

            <Text className="text-2xl font-bold text-green-600">
              {completedDeliveries}
            </Text>

            <Text className="mt-1 text-sm text-slate-500">
              Completed
            </Text>

          </View>

        </View>

        {/* ====================================== */}
        {/* ERROR */}
        {/* ====================================== */}

        {error && (
          <View className="mx-5 mt-5 rounded-xl bg-red-50 p-4">

            <Text className="font-semibold text-red-700">
              {error}
            </Text>

          </View>
        )}

        {/* ====================================== */}
        {/* MY DELIVERIES */}
        {/* ====================================== */}

        <View className="mx-5 mt-8">

          <Pressable
            onPress={() =>
              router.push(
                "/(driver)/deliveries"
              )
            }
            className="rounded-2xl bg-blue-700 py-5"
          >

            <Text className="text-center text-lg font-bold text-white">
              📦 MY DELIVERIES
            </Text>

            <Text className="mt-1 text-center text-blue-100">
              View and manage your deliveries
            </Text>

          </Pressable>

        </View>

        {/* ====================================== */}
        {/* ACTIVE DELIVERY */}
        {/* ====================================== */}

        {activeDeliveries > 0 && (

          <View className="mx-5 mt-5 rounded-2xl bg-white p-5">

            <Text className="text-lg font-bold text-slate-900">
              Active Delivery
            </Text>

            <Text className="mt-2 text-slate-500">
              You currently have an active delivery.
            </Text>

            {activeDelivery && (
  <Pressable
    onPress={() =>
      router.push({
        pathname: "/(driver)/delivery/[id]",
        params: {
          id: activeDelivery._id,
        },
      })
    }
    className="mt-4 rounded-xl bg-green-600 py-4"
  >
    <Text className="text-center font-bold text-white">
      VIEW ACTIVE DELIVERY
    </Text>
  </Pressable>
)}

          </View>

        )}

      </ScrollView>

    </View>
  );
};

export default DriverHome;