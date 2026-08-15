import { Pressable, ScrollView, Text, View } from "react-native";
import { useRouter } from "expo-router";

const AdminOrders = () => {
  const router = useRouter();

  // Temporary data.
  // This will come from the backend later.
  const orders = [
    {
      id: "1",
      orderNumber: "ORD-001",
      customerName: "Abubakar Ali",
      customerPhone: "08012345678",
      pickupLocation: "Warehouse, Abuja",
      deliveryLocation: "Garki, Abuja",
      driverName: "Ahmed Musa",
      status: "in_transit",
      amount: 15000,
    },
    {
      id: "2",
      orderNumber: "ORD-002",
      customerName: "Musa Ibrahim",
      customerPhone: "08023456789",
      pickupLocation: "Wuse, Abuja",
      deliveryLocation: "Maitama, Abuja",
      driverName: "Musa Ibrahim",
      status: "delivered",
      amount: 12000,
    },
    {
      id: "3",
      orderNumber: "ORD-003",
      customerName: "Fatima Sani",
      customerPhone: "08034567890",
      pickupLocation: "Kubwa, Abuja",
      deliveryLocation: "Gwarinpa, Abuja",
      driverName: "Not assigned",
      status: "pending",
      amount: 10000,
    },
  ];

  return (
    <View className="flex-1 bg-slate-100">

      {/* Fixed Header */}
      <View className="bg-blue-700 px-5 pb-7 pt-14">
        <Pressable onPress={() => router.back()}>
          <Text className="font-semibold text-white">
            ← Back
          </Text>
        </Pressable>

        <Text className="mt-5 text-2xl font-bold text-white">
          Manage Orders
        </Text>

        <Text className="mt-1 text-blue-100">
          {orders.length} orders registered
        </Text>
      </View>

      {/* Orders List */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          padding: 20,
          paddingBottom: 120,
        }}
      >
        {orders.map((order) => (
          <View
            key={order.id}
            className="mb-4 rounded-2xl bg-white p-5"
          >
            {/* Order Header */}
            <View className="flex-row items-center justify-between">

              <View>
                <Text className="text-lg font-bold text-slate-900">
                  {order.orderNumber}
                </Text>

                <Text className="mt-1 text-sm text-slate-500">
                  {order.customerName}
                </Text>
              </View>

              {/* Status */}
              <View
                className={`rounded-full px-3 py-1 ${
                  order.status === "pending"
                    ? "bg-orange-100"
                    : order.status === "in_transit"
                      ? "bg-blue-100"
                      : "bg-green-100"
                }`}
              >
                <Text
                  className={`text-xs font-bold ${
                    order.status === "pending"
                      ? "text-orange-600"
                      : order.status === "in_transit"
                        ? "text-blue-600"
                        : "text-green-600"
                  }`}
                >
                  {order.status === "in_transit"
                    ? "IN TRANSIT"
                    : order.status.toUpperCase()}
                </Text>
              </View>

            </View>

            {/* Customer */}
            <View className="mt-4">
              <Text className="text-xs font-semibold text-slate-400">
                CUSTOMER
              </Text>

              <Text className="mt-1 font-semibold text-slate-800">
                {order.customerName}
              </Text>

              <Text className="mt-1 text-sm text-slate-500">
                📞 {order.customerPhone}
              </Text>
            </View>

            {/* Locations */}
            <View className="mt-4 border-t border-slate-100 pt-4">

              <Text className="text-xs font-semibold text-slate-400">
                ROUTE
              </Text>

              <Text className="mt-2 text-sm text-slate-700">
                📍 {order.pickupLocation}
              </Text>

              <Text className="mt-2 text-sm text-slate-700">
                📍 {order.deliveryLocation}
              </Text>

            </View>

            {/* Driver + Amount */}
            <View className="mt-4 flex-row justify-between border-t border-slate-100 pt-4">

              <View>
                <Text className="text-xs text-slate-400">
                  DRIVER
                </Text>

                <Text className="mt-1 font-semibold text-slate-800">
                  {order.driverName}
                </Text>
              </View>

              <View>
                <Text className="text-xs text-slate-400">
                  AMOUNT
                </Text>

                <Text className="mt-1 font-bold text-slate-800">
                  ₦{order.amount.toLocaleString()}
                </Text>
              </View>

            </View>

            {/* View Button */}
            <Pressable
              onPress={() =>
                router.push({
                  pathname: "/(admin)/order-details",
                  params: {
                    id: order.id,
                  },
                })
              }
              className="mt-5 rounded-xl bg-blue-700 py-3"
            >
              <Text className="text-center font-bold text-white">
                VIEW ORDER
              </Text>
            </Pressable>

          </View>
        ))}
      </ScrollView>

    </View>
  );
};

export default AdminOrders;