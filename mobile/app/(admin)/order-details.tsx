import { Pressable, ScrollView, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

const AdminOrderDetails = () => {
  const router = useRouter();

  const { id } = useLocalSearchParams<{ id: string }>();

  // Temporary data.
  // This will come from the backend later.
  const orders = [
    {
      id: "1",
      orderNumber: "ORD-001",
      customerName: "Abubakar Ali",
      customerPhone: "08012345678",
      customerEmail: "abubakar@example.com",
      pickupLocation: "Warehouse, Abuja",
      deliveryLocation: "Garki, Abuja",
      driverName: "Ahmed Musa",
      driverPhone: "08012345678",
      status: "in_transit",
      amount: 15000,
      distance: 12.5,
      estimatedTime: 25,
    },
    {
      id: "2",
      orderNumber: "ORD-002",
      customerName: "Musa Ibrahim",
      customerPhone: "08023456789",
      customerEmail: "musa@example.com",
      pickupLocation: "Wuse, Abuja",
      deliveryLocation: "Maitama, Abuja",
      driverName: "Musa Ibrahim",
      driverPhone: "08023456789",
      status: "delivered",
      amount: 12000,
      distance: 8.2,
      estimatedTime: 18,
    },
    {
      id: "3",
      orderNumber: "ORD-003",
      customerName: "Fatima Sani",
      customerPhone: "08034567890",
      customerEmail: "fatima@example.com",
      pickupLocation: "Kubwa, Abuja",
      deliveryLocation: "Gwarinpa, Abuja",
      driverName: "Not assigned",
      driverPhone: "",
      status: "pending",
      amount: 10000,
      distance: 15.4,
      estimatedTime: 30,
    },
  ];

  const order = orders.find((item) => item.id === id);

  // Order not found
  if (!order) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-100 px-5">
        <Text className="text-xl font-bold text-slate-900">
          Order not found
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
          Order Details
        </Text>

        <Text className="mt-1 text-blue-100">
          {order.orderNumber}
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

        {/* Status */}
        <View className="rounded-2xl bg-white p-5">

          <View className="flex-row items-center justify-between">

            <View>
              <Text className="text-xs font-semibold text-slate-400">
                ORDER STATUS
              </Text>

              <Text className="mt-1 text-xl font-bold capitalize text-slate-900">
                {order.status.replace("_", " ")}
              </Text>
            </View>

            <View
              className={`rounded-full px-3 py-2 ${
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

        </View>

        {/* Customer Information */}
        <View className="mt-5 rounded-2xl bg-white p-5">

          <Text className="text-lg font-bold text-slate-900">
            Customer Information
          </Text>

          <View className="mt-5">

            <Text className="text-xs font-semibold text-slate-400">
              CUSTOMER
            </Text>

            <Text className="mt-1 text-base font-semibold text-slate-800">
              {order.customerName}
            </Text>

          </View>

          <View className="mt-4">

            <Text className="text-xs font-semibold text-slate-400">
              PHONE
            </Text>

            <Text className="mt-1 text-base text-slate-800">
              📞 {order.customerPhone}
            </Text>

          </View>

          <View className="mt-4">

            <Text className="text-xs font-semibold text-slate-400">
              EMAIL
            </Text>

            <Text className="mt-1 text-base text-slate-800">
              {order.customerEmail}
            </Text>

          </View>

        </View>

        {/* Route */}
        <View className="mt-5 rounded-2xl bg-white p-5">

          <Text className="text-lg font-bold text-slate-900">
            Delivery Route
          </Text>

          <View className="mt-5">

            <Text className="text-xs font-semibold text-slate-400">
              PICKUP LOCATION
            </Text>

            <Text className="mt-2 text-base text-slate-800">
              📍 {order.pickupLocation}
            </Text>

          </View>

          <View className="mt-5">

            <Text className="text-xs font-semibold text-slate-400">
              DELIVERY LOCATION
            </Text>

            <Text className="mt-2 text-base text-slate-800">
              📍 {order.deliveryLocation}
            </Text>

          </View>

        </View>

        {/* Driver */}
        <View className="mt-5 rounded-2xl bg-white p-5">

          <Text className="text-lg font-bold text-slate-900">
            Assigned Driver
          </Text>

          <View className="mt-5">

            <Text className="text-xs font-semibold text-slate-400">
              DRIVER
            </Text>

            <Text className="mt-1 text-base font-semibold text-slate-800">
              {order.driverName}
            </Text>

          </View>

          {order.driverPhone && (
            <View className="mt-4">

              <Text className="text-xs font-semibold text-slate-400">
                PHONE
              </Text>

              <Text className="mt-1 text-base text-slate-800">
                📞 {order.driverPhone}
              </Text>

            </View>
          )}

        </View>

        {/* Delivery Information */}
        <View className="mt-5 rounded-2xl bg-white p-5">

          <Text className="text-lg font-bold text-slate-900">
            Delivery Information
          </Text>

          <View className="mt-5 flex-row justify-between">

            <View>
              <Text className="text-xs text-slate-400">
                DISTANCE
              </Text>

              <Text className="mt-1 font-semibold text-slate-800">
                {order.distance} km
              </Text>
            </View>

            <View>
              <Text className="text-xs text-slate-400">
                ESTIMATED TIME
              </Text>

              <Text className="mt-1 font-semibold text-slate-800">
                {order.estimatedTime} min
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

        </View>

        {/* Actions */}
        <View className="mt-5">

          <Pressable
            onPress={() => {}}
            className="rounded-xl bg-blue-700 py-4"
          >
            <Text className="text-center font-bold text-white">
              VIEW DELIVERY
            </Text>
          </Pressable>

          <Pressable
            onPress={() => {}}
            className="mt-3 rounded-xl bg-slate-800 py-4"
          >
            <Text className="text-center font-bold text-white">
              CONTACT CUSTOMER
            </Text>
          </Pressable>

        </View>

      </ScrollView>
    </View>
  );
};

export default AdminOrderDetails;