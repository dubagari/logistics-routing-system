
import {
  Pressable,
  ScrollView,
  Text,
  View,
  Alert,
} from "react-native";

import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { logout } from "../../store/slices/authSlice";
import { router } from "expo-router";

const DriverProfile = () => {
  const dispatch = useAppDispatch();

  // ============================================
  // AUTH USER
  // ============================================

  const user = useAppSelector(
    (state) => state.auth.user
  );

  // ============================================
  // DELIVERIES
  // ============================================

  const deliveries = useAppSelector(
    (state) => state.deliveries.deliveries
  );

  const completedDeliveries = deliveries.filter(
    (delivery) => delivery.status === "delivered"
  ).length;

  const pendingDeliveries = deliveries.filter(
    (delivery) =>
      delivery.status === "pending" ||
      delivery.status === "assigned" ||
      delivery.status === "accepted" ||
      delivery.status === "in_transit"
  ).length;

  // ============================================
  // LOGOUT
  // ============================================

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: () => {
            dispatch(logout());
          },
        },
      ]
    );
  };

  // ============================================
  // NO USER
  // ============================================

  if (!user) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-100 px-5">
        <Text className="text-lg font-semibold text-slate-700">
          Driver information unavailable.
        </Text>
      </View>
    );
  }

  // ============================================
  // SCREEN
  // ============================================

  return (
    <View className="flex-1 bg-slate-100">

      {/* ======================================
          HEADER
      ====================================== */}

      <View className="bg-blue-700 px-5 pb-8 pt-14">

        <Text className="text-3xl font-bold text-white">
          My Profile
        </Text>

        <Text className="mt-1 text-blue-100">
          Driver account
        </Text>

      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 120,
        }}
      >

        {/* ======================================
            PROFILE CARD
        ====================================== */}

        <View className="mx-5 -mt-4 rounded-2xl bg-white p-5">

          <View className="items-center">

            {/* AVATAR */}

            <View className="h-24 w-24 items-center justify-center rounded-full bg-blue-100">
              <Text className="text-4xl">
                👤
              </Text>
            </View>

            {/* NAME */}

            <Text className="mt-4 text-xl font-bold text-slate-900">
              {user.name}
            </Text>

            {/* ROLE */}

            <Text className="mt-1 text-sm capitalize text-slate-500">
              {user.role}
            </Text>

            {/* STATUS */}

            <View
              className={`mt-3 rounded-full px-4 py-2 ${
                user.isActive
                  ? "bg-green-100"
                  : "bg-red-100"
              }`}
            >

              <Text
                className={`font-semibold ${
                  user.isActive
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {user.isActive
                  ? "● Available"
                  : "● Inactive"}
              </Text>

            </View>

          </View>

        </View>

        {/* ======================================
            CONTACT INFORMATION
        ====================================== */}

        <View className="mx-5 mt-5 rounded-2xl bg-white p-5">

          <Text className="text-lg font-bold text-slate-900">
            Contact Information
          </Text>

          {/* PHONE */}

          <View className="mt-5">

            <Text className="text-xs font-semibold text-slate-400">
              PHONE
            </Text>

            <Text className="mt-1 text-base text-slate-800">
              {user.phone || "Not provided"}
            </Text>

          </View>

          {/* EMAIL */}

          <View className="mt-5">

            <Text className="text-xs font-semibold text-slate-400">
              EMAIL
            </Text>

            <Text className="mt-1 text-base text-slate-800">
              {user.email}
            </Text>

          </View>

        </View>

        {/* ======================================
            DELIVERY STATISTICS
        ====================================== */}

        <View className="mx-5 mt-5 rounded-2xl bg-white p-5">

          <Text className="text-lg font-bold text-slate-900">
            Delivery Statistics
          </Text>

          <View className="mt-5 flex-row justify-between">

            {/* TOTAL */}

            <View className="flex-1 items-center">

              <Text className="text-2xl font-bold text-slate-900">
                {deliveries.length}
              </Text>

              <Text className="mt-1 text-sm text-slate-500">
                Total
              </Text>

            </View>

            {/* COMPLETED */}

            <View className="flex-1 items-center">

              <Text className="text-2xl font-bold text-green-600">
                {completedDeliveries}
              </Text>

              <Text className="mt-1 text-sm text-slate-500">
                Completed
              </Text>

            </View>

            {/* PENDING */}

            <View className="flex-1 items-center">

              <Text className="text-2xl font-bold text-orange-500">
                {pendingDeliveries}
              </Text>

              <Text className="mt-1 text-sm text-slate-500">
                Active
              </Text>

            </View>

          </View>

        </View>

        {/* ======================================
            SETTINGS
        ====================================== */}

        <View className="mx-5 mt-5 rounded-2xl bg-white">

          <Text className="px-5 pt-5 text-lg font-bold text-slate-900">
            Settings
          </Text>

          {/* NOTIFICATIONS */}

          <Pressable
            onPress={() => {
              Alert.alert(
                "Notifications",
                "Notification settings will be available here."
              );
            }}
            className="mt-4 border-t border-slate-100 px-5 py-4"
          >
            <Text className="font-semibold text-slate-800">
              🔔 Notifications
            </Text>
          </Pressable>

          {/* CHANGE PASSWORD */}

          <Pressable
            onPress={() => {
              Alert.alert(
                "Change Password",
                "Change password screen will be added next."
              );
            }}
            className="border-t border-slate-100 px-5 py-4"
          >
            <Text className="font-semibold text-slate-800">
              🔒 Change Password
            </Text>
          </Pressable>

        </View>

      {/* Logout */}
<Pressable
  onPress={() => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: () => {
            dispatch(logout());
            router.replace("/login");
          },
        },
      ]
    );
  }}
  className="mx-5 mt-5 rounded-xl bg-red-600 py-4"
>
  <Text className="text-center font-bold text-white">
    LOGOUT
  </Text>
</Pressable>

      </ScrollView>

    </View>
  );
};

export default DriverProfile;
