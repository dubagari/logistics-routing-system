import { Pressable, ScrollView, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useAppSelector } from "../../hooks/redux";

const CustomerTracking = () => {
  const router = useRouter();

  const { id } = useLocalSearchParams<{ id: string }>();

  const order = useAppSelector((state) =>
    state.deliveries.deliveries.find(
      (item) => item.id === id
    )
  );

  // Order not found
  if (!order) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-100 px-5">
        <Text className="text-xl font-bold text-slate-800">
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

  const isPending = order.status === "pending";
  const isInTransit = order.status === "in_transit";
  const isDelivered = order.status === "delivered";

  return (
    <View className="flex-1 bg-slate-100">

      {/* Fixed Header */}
      <View className="bg-blue-700 px-5 pb-6 pt-14">

        <Pressable onPress={() => router.back()}>
          <Text className="text-base font-semibold text-white">
            ← Back
          </Text>
        </Pressable>

        <Text className="mt-5 text-2xl font-bold text-white">
          Track Order
        </Text>

        <Text className="mt-1 text-blue-100">
          {order.orderNumber}
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

        {/* Current Status */}
        <View className="mx-5 rounded-2xl bg-white p-5">

          <Text className="text-xs font-semibold text-slate-400">
            CURRENT STATUS
          </Text>

          <Text
            className={`mt-2 text-xl font-bold ${
              isPending
                ? "text-orange-500"
                : isInTransit
                  ? "text-blue-600"
                  : "text-green-600"
            }`}
          >
            {isInTransit
              ? "IN TRANSIT"
              : order.status.toUpperCase()}
          </Text>

          <Text className="mt-2 text-sm text-slate-500">
            {isPending
              ? "Your order is waiting to be picked up."
              : isInTransit
                ? "Your order is currently on the way."
                : "Your order has been delivered successfully."}
          </Text>

        </View>

        {/* Map */}
        <View className="mx-5 mt-5 rounded-2xl bg-white p-5">

          <Text className="text-lg font-bold text-slate-900">
            Live Location
          </Text>

          <View className="mt-4 h-56 items-center justify-center rounded-xl bg-slate-200">

            <Text className="text-4xl">
              📍
            </Text>

            <Text className="mt-3 font-semibold text-slate-500">
              Map will appear here
            </Text>

            <Text className="mt-1 text-center text-xs text-slate-400">
              Real-time GPS tracking will be connected later.
            </Text>

          </View>

        </View>

        {/* Route */}
        <View className="mx-5 mt-5 rounded-2xl bg-white p-5">

          <Text className="text-lg font-bold text-slate-900">
            Delivery Route
          </Text>

          {/* Pickup */}
          <View className="mt-5 flex-row">

            <View className="items-center">

              <View className="h-4 w-4 rounded-full bg-blue-700" />

              <View className="h-14 w-0.5 bg-slate-200" />

            </View>

            <View className="ml-4 flex-1">

              <Text className="text-xs font-semibold text-slate-400">
                PICKUP
              </Text>

              <Text className="mt-1 text-base text-slate-800">
                {order.pickupLocation}
              </Text>

            </View>

          </View>

          {/* Delivery */}
          <View className="flex-row">

            <View className="items-center">

              <View
                className={`h-4 w-4 rounded-full ${
                  isDelivered
                    ? "bg-green-600"
                    : "bg-orange-500"
                }`}
              />

            </View>

            <View className="ml-4 flex-1">

              <Text className="text-xs font-semibold text-slate-400">
                DELIVERY
              </Text>

              <Text className="mt-1 text-base text-slate-800">
                {order.deliveryLocation}
              </Text>

            </View>

          </View>

        </View>

        {/* Delivery Progress */}
        <View className="mx-5 mt-5 rounded-2xl bg-white p-5">

          <Text className="text-lg font-bold text-slate-900">
            Delivery Progress
          </Text>

          {/* Step 1 */}
          <View className="mt-5 flex-row items-center">

            <View className="h-9 w-9 items-center justify-center rounded-full bg-green-100">
              <Text className="font-bold text-green-600">
                ✓
              </Text>
            </View>

            <View className="ml-4">
              <Text className="font-semibold text-slate-800">
                Order Assigned
              </Text>

              <Text className="text-sm text-slate-400">
                Driver has received the order
              </Text>
            </View>

          </View>

          {/* Step 2 */}
          <View className="mt-4 flex-row items-center">

            <View
              className={`h-9 w-9 items-center justify-center rounded-full ${
                isInTransit || isDelivered
                  ? "bg-green-100"
                  : "bg-slate-100"
              }`}
            >
              <Text
                className={
                  isInTransit || isDelivered
                    ? "font-bold text-green-600"
                    : "font-bold text-slate-400"
                }
              >
                {isInTransit || isDelivered ? "✓" : "2"}
              </Text>
            </View>

            <View className="ml-4">
              <Text className="font-semibold text-slate-800">
                In Transit
              </Text>

              <Text className="text-sm text-slate-400">
                Order is on the way
              </Text>
            </View>

          </View>

          {/* Step 3 */}
          <View className="mt-4 flex-row items-center">

            <View
              className={`h-9 w-9 items-center justify-center rounded-full ${
                isDelivered
                  ? "bg-green-100"
                  : "bg-slate-100"
              }`}
            >
              <Text
                className={
                  isDelivered
                    ? "font-bold text-green-600"
                    : "font-bold text-slate-400"
                }
              >
                {isDelivered ? "✓" : "3"}
              </Text>
            </View>

            <View className="ml-4">
              <Text className="font-semibold text-slate-800">
                Delivered
              </Text>

              <Text className="text-sm text-slate-400">
                Order delivered to customer
              </Text>
            </View>

          </View>

        </View>

        {/* Distance / Time */}
        <View className="mx-5 mt-5 flex-row gap-3">

          <View className="flex-1 rounded-2xl bg-white p-5">

            <Text className="text-xs text-slate-400">
              DISTANCE
            </Text>

            <Text className="mt-2 text-lg font-bold text-slate-800">
              {order.distance} km
            </Text>

          </View>

          <View className="flex-1 rounded-2xl bg-white p-5">

            <Text className="text-xs text-slate-400">
              EST. TIME
            </Text>

            <Text className="mt-2 text-lg font-bold text-slate-800">
              {order.estimatedTime} min
            </Text>

          </View>

        </View>

      </ScrollView>

    </View>
  );
};

export default CustomerTracking;