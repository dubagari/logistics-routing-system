import { Pressable, ScrollView, Text, View } from "react-native";
import { useRouter } from "expo-router";

const AdminDashboard = () => {
  const router = useRouter();

  // Temporary statistics.
  // These will come from the backend later.
  const statistics = {
    customers: 24,
    drivers: 8,
    orders: 32,
    deliveries: 18,
  };

  return (
    <View className="flex-1 bg-slate-100">

      {/* Fixed Header */}
      <View className="bg-blue-700 px-5 pb-8 pt-14">
        <Text className="text-sm text-blue-100">
          Welcome 👋
        </Text>

        <Text className="mt-1 text-2xl font-bold text-white">
          Admin Dashboard
        </Text>

        <Text className="mt-1 text-blue-100">
          Manage your logistics system
        </Text>
      </View>

      {/* Scrollable Content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: 20,
          paddingBottom: 120,
        }}
      >

        {/* Statistics */}
        <View className="mx-5">

          <Text className="mb-3 text-lg font-bold text-slate-900">
            Overview
          </Text>

          <View className="flex-row gap-3">

            {/* Customers */}
            <View className="flex-1 rounded-2xl bg-white p-5">
              <Text className="text-2xl">
                👥
              </Text>

              <Text className="mt-3 text-2xl font-bold text-slate-900">
                {statistics.customers}
              </Text>

              <Text className="mt-1 text-sm text-slate-500">
                Customers
              </Text>
            </View>

            {/* Drivers */}
            <View className="flex-1 rounded-2xl bg-white p-5">
              <Text className="text-2xl">
                🚚
              </Text>

              <Text className="mt-3 text-2xl font-bold text-slate-900">
                {statistics.drivers}
              </Text>

              <Text className="mt-1 text-sm text-slate-500">
                Drivers
              </Text>
            </View>

          </View>

          <View className="mt-3 flex-row gap-3">

            {/* Orders */}
            <View className="flex-1 rounded-2xl bg-white p-5">
              <Text className="text-2xl">
                📦
              </Text>

              <Text className="mt-3 text-2xl font-bold text-slate-900">
                {statistics.orders}
              </Text>

              <Text className="mt-1 text-sm text-slate-500">
                Orders
              </Text>
            </View>

            {/* Deliveries */}
            <View className="flex-1 rounded-2xl bg-white p-5">
              <Text className="text-2xl">
                📍
              </Text>

              <Text className="mt-3 text-2xl font-bold text-slate-900">
                {statistics.deliveries}
              </Text>

              <Text className="mt-1 text-sm text-slate-500">
                Deliveries
              </Text>
            </View>

          </View>

        </View>

        {/* Recent Deliveries */}
        <View className="mx-5 mt-6 rounded-2xl bg-white p-5">

          <Text className="text-lg font-bold text-slate-900">
            Recent Deliveries
          </Text>

          {/* Delivery 1 */}
          <View className="mt-5 border-b border-slate-100 pb-4">

            <View className="flex-row items-center justify-between">
              <Text className="font-bold text-slate-900">
                ORD-001
              </Text>

              <Text className="text-xs font-bold text-blue-600">
                IN TRANSIT
              </Text>
            </View>

            <Text className="mt-2 text-sm text-slate-500">
              Driver: Ahmed
            </Text>

            <Text className="mt-1 text-sm text-slate-500">
              Abuja → Garki
            </Text>

          </View>

          {/* Delivery 2 */}
          <View className="mt-4 border-b border-slate-100 pb-4">

            <View className="flex-row items-center justify-between">
              <Text className="font-bold text-slate-900">
                ORD-002
              </Text>

              <Text className="text-xs font-bold text-green-600">
                DELIVERED
              </Text>
            </View>

            <Text className="mt-2 text-sm text-slate-500">
              Driver: Musa
            </Text>

            <Text className="mt-1 text-sm text-slate-500">
              Wuse → Maitama
            </Text>

          </View>

          {/* Delivery 3 */}
          <View className="mt-4">

            <View className="flex-row items-center justify-between">
              <Text className="font-bold text-slate-900">
                ORD-003
              </Text>

              <Text className="text-xs font-bold text-orange-500">
                PENDING
              </Text>
            </View>

            <Text className="mt-2 text-sm text-slate-500">
              Driver: Not assigned
            </Text>

            <Text className="mt-1 text-sm text-slate-500">
              Kubwa → Gwarinpa
            </Text>

          </View>

        </View>

        {/* Quick Actions */}
        <View className="mx-5 mt-6">

          <Text className="mb-3 text-lg font-bold text-slate-900">
            Quick Actions
          </Text>

          {/* Drivers */}
          <Pressable
            onPress={() => router.push("/(admin)/drivers")}
            className="rounded-xl bg-white p-5"
          >
            <Text className="font-bold text-slate-900">
              🚚 Manage Drivers
            </Text>

            <Text className="mt-1 text-sm text-slate-500">
              View and manage delivery drivers
            </Text>
          </Pressable>

          {/* Orders */}
          <Pressable
           onPress={() => router.push("/(admin)/orders")}
            className="mt-3 rounded-xl bg-white p-5"
          >
            <Text className="font-bold text-slate-900">
              📦 Manage Orders
            </Text>

            <Text className="mt-1 text-sm text-slate-500">
              View and manage customer orders
            </Text>
          </Pressable>

          {/* Customers */}
          <Pressable
             onPress={() => router.push("/(admin)/customers")}
            className="mt-3 rounded-xl bg-white p-5"
          >
            <Text className="font-bold text-slate-900">
              👥 Manage Customers
            </Text>

            <Text className="mt-1 text-sm text-slate-500">
              View and manage customers
            </Text>
          </Pressable>

          <Pressable
  onPress={() => router.push("/(admin)/deliveries")}
  className="mt-3 rounded-xl bg-white p-5"
>
  <Text className="font-bold text-slate-900">
    🚚 Manage Deliveries
  </Text>

  <Text className="mt-1 text-sm text-slate-500">
    Monitor and manage active deliveries
  </Text>
</Pressable>

<Pressable
  onPress={() => router.push("/(admin)/profile")}
  className="mx-5 mt-5 rounded-xl bg-slate-800 py-4"
>
  <Text className="text-center font-bold text-white">
    👤 ADMIN PROFILE
  </Text>
</Pressable>

        </View>

      </ScrollView>

    </View>
  );
};

export default AdminDashboard;