import { Pressable, ScrollView, Text, View } from "react-native";
import { useRouter } from "expo-router";

const AdminDeliveries = () => {
  const router = useRouter();

  // Temporary data.
  // Later this will come from the backend.
  const deliveries = [
    {
      id: "1",
      orderNumber: "ORD-001",
      customerName: "Abubakar Ali",
      driverName: "Ahmed Musa",
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
      driverName: "Musa Ibrahim",
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
      driverName: "Not assigned",
      pickupLocation: "Kubwa, Abuja",
      deliveryLocation: "Gwarinpa, Abuja",
      status: "pending",
      distance: 15.4,
      estimatedTime: 30,
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
          Manage Deliveries
        </Text>

        <Text className="mt-1 text-blue-100">
          {deliveries.length} deliveries
        </Text>

      </View>

      {/* Delivery List */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          padding: 20,
          paddingBottom: 120,
        }}
      >

        {deliveries.map((delivery) => (
          <View
            key={delivery.id}
            className="mb-4 rounded-2xl bg-white p-5"
          >

            {/* Header */}
            <View className="flex-row items-center justify-between">

              <View>
                <Text className="text-lg font-bold text-slate-900">
                  {delivery.orderNumber}
                </Text>

                <Text className="mt-1 text-sm text-slate-500">
                  {delivery.customerName}
                </Text>
              </View>

              {/* Status */}
              <View
                className={`rounded-full px-3 py-1 ${
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

            {/* Driver */}
            <View className="mt-4">
              <Text className="text-xs font-semibold text-slate-400">
                DRIVER
              </Text>

              <Text className="mt-1 font-semibold text-slate-800">
                🚚 {delivery.driverName}
              </Text>
            </View>

            {/* Route */}
            <View className="mt-4 border-t border-slate-100 pt-4">

              <Text className="text-xs font-semibold text-slate-400">
                ROUTE
              </Text>

              <Text className="mt-2 text-sm text-slate-700">
                📍 {delivery.pickupLocation}
              </Text>

              <Text className="mt-2 text-sm text-slate-700">
                📍 {delivery.deliveryLocation}
              </Text>

            </View>

            {/* Distance / Time */}
            <View className="mt-4 flex-row justify-between border-t border-slate-100 pt-4">

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

            {/* View */}
            <Pressable
              onPress={() =>
                router.push({
                  pathname: "/(admin)/delivery-details",
                  params: {
                    id: delivery.id,
                  },
                })
              }
              className="mt-5 rounded-xl bg-blue-700 py-3"
            >
              <Text className="text-center font-bold text-white">
                VIEW DELIVERY
              </Text>
            </Pressable>

          </View>
        ))}

      </ScrollView>
    </View>
  );
};

export default AdminDeliveries;