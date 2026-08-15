import { Pressable, ScrollView, Text, View } from "react-native";
import { useRouter } from "expo-router";

const CustomerDashboard = () => {
  const router = useRouter();

  // Temporary data.
  // Later these values will come from the backend.
  const customer = {
    name: "Abubakar Ali",
    totalOrders: 5,
    pendingOrders: 2,
    completedOrders: 3,
  };

  return (
    <View className="flex-1 bg-slate-100">

      {/* Fixed Header */}
      <View className="bg-blue-700 px-5 pb-7 pt-14">
        <Text className="text-blue-100">
          Welcome back 👋
        </Text>

        <Text className="mt-1 text-2xl font-bold text-white">
          {customer.name}
        </Text>

        <Text className="mt-1 text-blue-100">
          Track your deliveries and orders
        </Text>
      </View>

      {/* Scrollable Content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          padding: 20,
          paddingBottom: 120,
        }}
      >

        {/* Statistics */}
        <View className="flex-row gap-3">

          <View className="flex-1 rounded-2xl bg-white p-4">
            <Text className="text-2xl font-bold text-slate-900">
              {customer.totalOrders}
            </Text>

            <Text className="mt-1 text-sm text-slate-500">
              Total Orders
            </Text>
          </View>

          <View className="flex-1 rounded-2xl bg-white p-4">
            <Text className="text-2xl font-bold text-orange-500">
              {customer.pendingOrders}
            </Text>

            <Text className="mt-1 text-sm text-slate-500">
              Pending
            </Text>
          </View>

          <View className="flex-1 rounded-2xl bg-white p-4">
            <Text className="text-2xl font-bold text-green-600">
              {customer.completedOrders}
            </Text>

            <Text className="mt-1 text-sm text-slate-500">
              Completed
            </Text>
          </View>

        </View>

        {/* Place Order */}
        <View className="mt-5 rounded-2xl bg-white p-5">

          <Text className="text-lg font-bold text-slate-900">
            Need a Delivery?
          </Text>

          <Text className="mt-2 text-sm leading-5 text-slate-500">
            Create a new delivery order and provide your pickup
            and delivery locations.
          </Text>

          <Pressable
            onPress={() => router.push("/(customer)/create-order")}
            className="mt-5 rounded-xl bg-blue-700 py-4"
          >
            <Text className="text-center font-bold text-white">
              CREATE NEW ORDER
            </Text>
          </Pressable>

        </View>

        {/* Recent Orders */}
        <View className="mt-5 rounded-2xl bg-white p-5">

          <View className="flex-row items-center justify-between">
            <Text className="text-lg font-bold text-slate-900">
              Recent Orders
            </Text>

            <Pressable
              onPress={() => router.push("/(customer)/orders")}
            >
              <Text className="font-semibold text-blue-700">
                View All
              </Text>
            </Pressable>
          </View>

          {/* Temporary Order */}
          <View className="mt-5 border-t border-slate-100 pt-4">

            <View className="flex-row items-center justify-between">

              <View>
                <Text className="font-bold text-slate-900">
                  ORD-001
                </Text>

                <Text className="mt-1 text-sm text-slate-500">
                  Warehouse → Garki
                </Text>
              </View>

              <View className="rounded-full bg-blue-100 px-3 py-1">
                <Text className="text-xs font-bold text-blue-600">
                  IN TRANSIT
                </Text>
              </View>

            </View>

          </View>

          {/* Second Order */}
          <View className="mt-4 border-t border-slate-100 pt-4">

            <View className="flex-row items-center justify-between">

              <View>
                <Text className="font-bold text-slate-900">
                  ORD-002
                </Text>

                <Text className="mt-1 text-sm text-slate-500">
                  Wuse → Maitama
                </Text>
              </View>

              <View className="rounded-full bg-green-100 px-3 py-1">
                <Text className="text-xs font-bold text-green-600">
                  DELIVERED
                </Text>
              </View>

            </View>

          </View>

        </View>

        {/* Profile */}
        <Pressable
          onPress={() => router.push("/(customer)/profile")}
          className="mt-5 rounded-xl bg-slate-800 py-4"
        >
          <Text className="text-center font-bold text-white">
            👤 MY PROFILE
          </Text>
        </Pressable>

      </ScrollView>
    </View>
  );
};

export default CustomerDashboard;