import { Pressable, ScrollView, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

const TrackDelivery = () => {
  const router = useRouter();

  const { id } = useLocalSearchParams<{ id: string }>();

  // Temporary data.
  // Later this will come from the backend and GPS.
  const deliveries = [
    {
      id: "1",
      orderNumber: "ORD-001",
      customerName: "Abubakar Ali",
      driverName: "Ahmed Musa",
      driverPhone: "08012345678",
      pickupLocation: "Warehouse, Abuja",
      deliveryLocation: "Garki, Abuja",
      status: "in_transit",
      distance: 12.5,
      remainingDistance: 5.8,
      estimatedTime: 25,
      remainingTime: 12,
    },
    {
      id: "2",
      orderNumber: "ORD-002",
      customerName: "Musa Ibrahim",
      driverName: "Musa Ibrahim",
      driverPhone: "08023456789",
      pickupLocation: "Wuse, Abuja",
      deliveryLocation: "Maitama, Abuja",
      status: "delivered",
      distance: 8.2,
      remainingDistance: 0,
      estimatedTime: 18,
      remainingTime: 0,
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
          Track Delivery
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

        {/* Map */}
        <View className="overflow-hidden rounded-2xl bg-white">

          <View className="h-72 items-center justify-center bg-slate-200">

            <Text className="text-4xl">
              🗺️
            </Text>

            <Text className="mt-3 text-lg font-bold text-slate-700">
              Live Map
            </Text>

            <Text className="mt-1 px-10 text-center text-sm text-slate-500">
              Driver location and optimized route will appear here.
            </Text>

          </View>

        </View>

        {/* Delivery Status */}
        <View className="mt-5 rounded-2xl bg-white p-5">

          <View className="flex-row items-center justify-between">

            <View>
              <Text className="text-xs font-semibold text-slate-400">
                DELIVERY STATUS
              </Text>

              <Text className="mt-1 text-xl font-bold text-blue-700">
                In Transit
              </Text>
            </View>

            <View className="h-12 w-12 items-center justify-center rounded-full bg-blue-100">
              <Text className="text-xl">
                🚚
              </Text>
            </View>

          </View>

          <Text className="mt-3 text-sm text-slate-500">
            Your driver is currently on the way.
          </Text>

        </View>

        {/* Progress */}
        <View className="mt-5 rounded-2xl bg-white p-5">

          <View className="flex-row items-center justify-between">

            <Text className="text-lg font-bold text-slate-900">
              Delivery Progress
            </Text>

            <Text className="font-bold text-blue-700">
              {delivery.remainingDistance} km left
            </Text>

          </View>

          {/* Progress Bar */}
          <View className="mt-5 h-3 overflow-hidden rounded-full bg-slate-200">

            <View
              className="h-full rounded-full bg-blue-700"
              style={{
                width: `${Math.max(
                  10,
                  Math.min(
                    100,
                    ((delivery.distance -
                      delivery.remainingDistance) /
                      delivery.distance) *
                      100
                  )
                )}%`,
              }}
            />

          </View>

          <View className="mt-3 flex-row justify-between">

            <Text className="text-xs text-slate-500">
              Pickup
            </Text>

            <Text className="text-xs text-slate-500">
              Delivery
            </Text>

          </View>

        </View>

        {/* Estimated Arrival */}
        <View className="mt-5 rounded-2xl bg-white p-5">

          <Text className="text-lg font-bold text-slate-900">
            Estimated Arrival
          </Text>

          <View className="mt-5 flex-row justify-between">

            <View>
              <Text className="text-xs text-slate-400">
                REMAINING TIME
              </Text>

              <Text className="mt-1 text-xl font-bold text-slate-800">
                {delivery.remainingTime} min
              </Text>
            </View>

            <View>
              <Text className="text-xs text-slate-400">
                REMAINING DISTANCE
              </Text>

              <Text className="mt-1 text-xl font-bold text-slate-800">
                {delivery.remainingDistance} km
              </Text>
            </View>

          </View>

        </View>

        {/* Route */}
        <View className="mt-5 rounded-2xl bg-white p-5">

          <Text className="text-lg font-bold text-slate-900">
            Current Route
          </Text>

          <View className="mt-5">

            <Text className="text-xs font-semibold text-slate-400">
              PICKUP
            </Text>

            <Text className="mt-2 text-base text-slate-800">
              📍 {delivery.pickupLocation}
            </Text>

          </View>

          <View className="mt-5">

            <Text className="text-xs font-semibold text-slate-400">
              DESTINATION
            </Text>

            <Text className="mt-2 text-base text-slate-800">
              📍 {delivery.deliveryLocation}
            </Text>

          </View>

        </View>

        {/* Driver */}
        <View className="mt-5 rounded-2xl bg-white p-5">

          <Text className="text-lg font-bold text-slate-900">
            Driver Information
          </Text>

          <Text className="mt-5 text-base font-semibold text-slate-800">
            🚚 {delivery.driverName}
          </Text>

          <Text className="mt-2 text-slate-500">
            📞 {delivery.driverPhone}
          </Text>

        </View>

        {/* Action */}
        <Pressable
          onPress={() => router.back()}
          className="mt-5 rounded-xl bg-slate-800 py-4"
        >
          <Text className="text-center font-bold text-white">
            BACK TO ORDER
          </Text>
        </Pressable>

      </ScrollView>
    </View>
  );
};

export default TrackDelivery;