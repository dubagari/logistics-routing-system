import { Pressable, ScrollView, Text, View } from "react-native";
import { useAppSelector } from "../../hooks/redux";

const DriverProfile = () => {
  const deliveries = useAppSelector(
    (state) => state.deliveries.deliveries
  );

  const completedDeliveries = deliveries.filter(
    (delivery) => delivery.status === "delivered"
  ).length;

  const pendingDeliveries = deliveries.filter(
    (delivery) => delivery.status === "pending"
  ).length;

  return (
    <View className="flex-1 bg-slate-100">

      {/* Header */}
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

        {/* Profile Card */}
        <View className="mx-5 -mt-4 rounded-2xl bg-white p-5">

          <View className="items-center">

            {/* Avatar */}
            <View className="h-24 w-24 items-center justify-center rounded-full bg-blue-100">
              <Text className="text-4xl">
                👤
              </Text>
            </View>

            <Text className="mt-4 text-xl font-bold text-slate-900">
              Driver
            </Text>

            <Text className="mt-1 text-sm text-slate-500">
              Professional Driver
            </Text>

            {/* Status */}
            <View className="mt-3 rounded-full bg-green-100 px-4 py-2">
              <Text className="font-semibold text-green-600">
                ● Available
              </Text>
            </View>

          </View>

        </View>

        {/* Contact Information */}
        <View className="mx-5 mt-5 rounded-2xl bg-white p-5">

          <Text className="text-lg font-bold text-slate-900">
            Contact Information
          </Text>

          <View className="mt-5">

            <Text className="text-xs font-semibold text-slate-400">
              PHONE
            </Text>

            <Text className="mt-1 text-base text-slate-800">
              08012345678
            </Text>

          </View>

          <View className="mt-5">

            <Text className="text-xs font-semibold text-slate-400">
              EMAIL
            </Text>

            <Text className="mt-1 text-base text-slate-800">
              driver@example.com
            </Text>

          </View>

        </View>

        {/* Statistics */}
        <View className="mx-5 mt-5 rounded-2xl bg-white p-5">

          <Text className="text-lg font-bold text-slate-900">
            Delivery Statistics
          </Text>

          <View className="mt-5 flex-row justify-between">

            {/* Total */}
            <View className="items-center">
              <Text className="text-2xl font-bold text-slate-900">
                {deliveries.length}
              </Text>

              <Text className="mt-1 text-sm text-slate-500">
                Total
              </Text>
            </View>

            {/* Completed */}
            <View className="items-center">
              <Text className="text-2xl font-bold text-green-600">
                {completedDeliveries}
              </Text>

              <Text className="mt-1 text-sm text-slate-500">
                Completed
              </Text>
            </View>

            {/* Pending */}
            <View className="items-center">
              <Text className="text-2xl font-bold text-orange-500">
                {pendingDeliveries}
              </Text>

              <Text className="mt-1 text-sm text-slate-500">
                Pending
              </Text>
            </View>

          </View>

        </View>

        {/* Settings */}
        <View className="mx-5 mt-5 rounded-2xl bg-white">

          <Text className="px-5 pt-5 text-lg font-bold text-slate-900">
            Settings
          </Text>

          <Pressable className="mt-4 border-t border-slate-100 px-5 py-4">
            <Text className="font-semibold text-slate-800">
              🔔 Notifications
            </Text>
          </Pressable>

          <Pressable className="border-t border-slate-100 px-5 py-4">
            <Text className="font-semibold text-slate-800">
              🔒 Change Password
            </Text>
          </Pressable>

        </View>

        {/* Logout */}
        <Pressable
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