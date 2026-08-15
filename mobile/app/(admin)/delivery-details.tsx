import { Pressable, ScrollView, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

const AdminDeliveryDetails = () => {
  const router = useRouter();

  const { id } = useLocalSearchParams<{ id: string }>();

  // Temporary data.
  // Later this will come from the backend.
  const deliveries = [
    {
      id: "1",
      orderNumber: "ORD-001",
      customerName: "Abubakar Ali",
      customerPhone: "08012345678",
      driverName: "Ahmed Musa",
      driverPhone: "08012345678",
      pickupLocation: "Warehouse, Abuja",
      deliveryLocation: "Garki, Abuja",
      status: "in_transit",
      distance: 12.5,
      estimatedTime: 25,
    },
    {
      id: "2",
      orderNumber: "ORD-002",
      customerName: "Musa Ibrahim",
      customerPhone: "08023456789",
      driverName: "Musa Ibrahim",
      driverPhone: "08023456789",
      pickupLocation: "Wuse, Abuja",
      deliveryLocation: "Maitama, Abuja",
      status: "delivered",
      distance: 8.2,
      estimatedTime: 18,
    },
    {
      id: "3",
      orderNumber: "ORD-003",
      customerName: "Fatima Sani",
      customerPhone: "08034567890",
      driverName: "Not assigned",
      driverPhone: "",
      pickupLocation: "Kubwa, Abuja",
      deliveryLocation: "Gwarinpa, Abuja",
      status: "pending",
      distance: 15.4,
      estimatedTime: 30,
    },
  ];

  const delivery = deliveries.find((item) => item.id === id);

  if (!delivery) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-100 px-5">
        <Text className="text-xl font-bold text-slate-900">
          Delivery not found
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
          Delivery Details
        </Text>

        <Text className="mt-1 text-blue-100">
          {delivery.orderNumber}
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

          <Text className="text-xs font-semibold text-slate-400">
            DELIVERY STATUS
          </Text>

          <View className="mt-2 flex-row items-center justify-between">

            <Text className="text-xl font-bold capitalize text-slate-900">
              {delivery.status.replace("_", " ")}
            </Text>

            <View
              className={`rounded-full px-3 py-2 ${
                delivery.status === "pending"
                  ? "bg-orange-100"
                  : delivery.status === "in_transit"
                    ? "bg-blue-100"
                    : "bg-green-100"
              }`}
            >
              <Text
                className={`text-xs font-bold ${
                  delivery.status === "pending"
                    ? "text-orange-600"
                    : delivery.status === "in_transit"
                      ? "text-blue-600"
                      : "text-green-600"
                }`}
              >
                {delivery.status === "in_transit"
                  ? "IN TRANSIT"
                  : delivery.status.toUpperCase()}
              </Text>
            </View>

          </View>

        </View>

        {/* Customer */}
        <View className="mt-5 rounded-2xl bg-white p-5">

          <Text className="text-lg font-bold text-slate-900">
            Customer
          </Text>

          <View className="mt-5">

            <Text className="text-xs font-semibold text-slate-400">
              NAME
            </Text>

            <Text className="mt-1 text-base font-semibold text-slate-800">
              {delivery.customerName}
            </Text>

          </View>

          <View className="mt-4">

            <Text className="text-xs font-semibold text-slate-400">
              PHONE
            </Text>

            <Text className="mt-1 text-base text-slate-800">
              📞 {delivery.customerPhone}
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
              🚚 {delivery.driverName}
            </Text>

          </View>

          {delivery.driverPhone && (
            <View className="mt-4">

              <Text className="text-xs font-semibold text-slate-400">
                PHONE
              </Text>

              <Text className="mt-1 text-base text-slate-800">
                📞 {delivery.driverPhone}
              </Text>

            </View>
          )}

        </View>

        {/* Locations */}
        <View className="mt-5 rounded-2xl bg-white p-5">

          <Text className="text-lg font-bold text-slate-900">
            Delivery Route
          </Text>

          <View className="mt-5">

            <Text className="text-xs font-semibold text-slate-400">
              PICKUP LOCATION
            </Text>

            <Text className="mt-2 text-base text-slate-800">
              📍 {delivery.pickupLocation}
            </Text>

          </View>

          <View className="mt-5">

            <Text className="text-xs font-semibold text-slate-400">
              DELIVERY LOCATION
            </Text>

            <Text className="mt-2 text-base text-slate-800">
              📍 {delivery.deliveryLocation}
            </Text>

          </View>

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
                {delivery.distance} km
              </Text>
            </View>

            <View>
              <Text className="text-xs text-slate-400">
                ESTIMATED TIME
              </Text>

              <Text className="mt-1 font-semibold text-slate-800">
                {delivery.estimatedTime} min
              </Text>
            </View>

          </View>

        </View>

        {/* Actions */}
        <View className="mt-5">

          {delivery.status === "pending" && (
            <Pressable
              onPress={() => {}}
              className="rounded-xl bg-blue-700 py-4"
            >
              <Text className="text-center font-bold text-white">
                ASSIGN DRIVER
              </Text>
            </Pressable>
          )}

          {delivery.status === "in_transit" && (
            <Pressable
              onPress={() => {}}
              className="rounded-xl bg-green-600 py-4"
            >
              <Text className="text-center font-bold text-white">
                MARK AS DELIVERED
              </Text>
            </Pressable>
          )}

          {delivery.status === "delivered" && (
            <View className="rounded-xl bg-green-100 py-4">
              <Text className="text-center font-bold text-green-700">
                ✓ DELIVERY COMPLETED
              </Text>
            </View>
          )}

        </View>

      </ScrollView>
    </View>
  );
};

export default AdminDeliveryDetails;