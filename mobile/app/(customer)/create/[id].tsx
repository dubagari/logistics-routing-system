import { Pressable, ScrollView, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useAppSelector } from "../../../hooks/redux";

const CustomerOrderDetails = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const { deliveries } = useAppSelector((state) => state.deliveries);
  
  // Find the delivery from the Redux store
  const order = deliveries.find((item) => item._id === id);

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
          ID: {order._id.slice(-8).toUpperCase()}
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
            ORDER STATUS
          </Text>

          <View className="mt-2 flex-row items-center justify-between">

            <Text className="text-xl font-bold capitalize text-slate-900">
              {order.status ? order.status.replace("_", " ") : "Pending"}
            </Text>

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
                  : (order.status || "pending").toUpperCase()}
              </Text>
            </View>

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
              📍 {order.pickupLocation?.address || "N/A"}
            </Text>

          </View>

          <View className="mt-5">

            <Text className="text-xs font-semibold text-slate-400">
              DELIVERY LOCATION
            </Text>

            <Text className="mt-2 text-base text-slate-800">
              📍 {order.deliveryLocation?.address || "N/A"}
            </Text>

          </View>

        </View>

        {/* Driver */}
        <View className="mt-5 rounded-2xl bg-white p-5">

          <Text className="text-lg font-bold text-slate-900">
            Driver
          </Text>

          <Text className="mt-5 text-xs font-semibold text-slate-400">
            DRIVER NAME
          </Text>

          <Text className="mt-1 text-base font-semibold text-slate-800">
            🚚 {typeof order.driver === "object" ? order.driver?.name : "Not assigned"}
          </Text>

          {typeof order.driver === "object" && order.driver?.phone && (
            <>
              <Text className="mt-4 text-xs font-semibold text-slate-400">
                PHONE
              </Text>

              <Text className="mt-1 text-base text-slate-800">
                📞 {order.driver.phone}
              </Text>
            </>
          )}

        </View>

        {/* Package */}
        <View className="mt-5 rounded-2xl bg-white p-5">

          <Text className="text-lg font-bold text-slate-900">
            Package
          </Text>

          <Text className="mt-5 text-xs font-semibold text-slate-400">
            DESCRIPTION
          </Text>

          <Text className="mt-1 text-base text-slate-800">
            {order.packageDescription}
          </Text>

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
                {order.distance ? `${order.distance} km` : "N/A"}
              </Text>
            </View>

            <View>
              <Text className="text-xs text-slate-400">
                TIME
              </Text>

              <Text className="mt-1 font-semibold text-slate-800">
                {order.estimatedTime ? `${order.estimatedTime} min` : "N/A"}
              </Text>
            </View>

            <View>
              <Text className="text-xs text-slate-400">
                AMOUNT
              </Text>

              <Text className="mt-1 font-bold text-slate-800">
                ₦{order.distance ? (order.distance * 1200).toLocaleString() : "TBD"}
              </Text>
            </View>

          </View>

        </View>

        {/* Actions */}
        <View className="mt-5">

          {order.status === "in_transit" && (
            <Pressable
              onPress={() =>
                router.push({
                  pathname: "/(customer)/track-delivery",
                  params: {
                    id: order._id,
                  },
                })
              }
              className="rounded-xl bg-blue-700 py-4"
            >
              <Text className="text-center font-bold text-white">
                TRACK DELIVERY
              </Text>
            </Pressable>
          )}

          {order.status === "pending" && (
            <View className="rounded-xl bg-orange-100 py-4">
              <Text className="text-center font-bold text-orange-600">
                WAITING FOR DRIVER
              </Text>
            </View>
          )}

          {order.status === "delivered" && (
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

export default CustomerOrderDetails;