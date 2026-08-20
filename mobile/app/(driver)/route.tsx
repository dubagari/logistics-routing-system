import { FlatList, Pressable, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useAppSelector } from "../../hooks/redux";

const DriverRoute = () => {
  const router = useRouter();

  const deliveries = useAppSelector(
    (state) => state.deliveries.deliveries
  );

  const nextDelivery = deliveries.find(
    (delivery) => delivery.status !== "delivered"
  );

  const totalDistance = deliveries.reduce(
    (total, delivery) => total + delivery.distance,
    0
  );

  const totalEstimatedTime = deliveries.reduce(
    (total, delivery) => total + delivery.estimatedTime,
    0
  );

  const completedDeliveries = deliveries.filter(
    (delivery) => delivery.status === "delivered"
  ).length;

  const progress =
    deliveries.length === 0
      ? 0
      : completedDeliveries / deliveries.length;

  const progressPercentage = Math.round(progress * 100);

  return (
    <View className="flex-1 bg-slate-100">

      {/* Header */}
      <View className="bg-blue-700 px-5 pb-8 pt-14">
        <Text className="text-3xl font-bold text-white">
          Today's Route
        </Text>

        <Text className="mt-1 text-blue-100">
          {deliveries.length} stops on your route
        </Text>
      </View>

      <FlatList
        data={deliveries}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 120,
        }}

        /* =========================
           TOP OF LIST
        ========================= */
        ListHeaderComponent={
          <>
            {/* Route Overview */}
            <View className="mx-5 mt-5 rounded-2xl bg-white p-5">
              <Text className="text-lg font-bold text-slate-900">
                Route Overview
              </Text>

              <View className="mt-4 flex-row justify-between">

                {/* Stops */}
                <View>
                  <Text className="text-xs text-slate-400">
                    STOPS
                  </Text>

                  <Text className="mt-1 text-lg font-bold text-slate-800">
                    {deliveries.length}
                  </Text>
                </View>

                {/* Distance */}
                <View>
                  <Text className="text-xs text-slate-400">
                    DISTANCE
                  </Text>

                  <Text className="mt-1 text-lg font-bold text-slate-800">
                    {totalDistance.toFixed(1)} km
                  </Text>
                </View>

                {/* Time */}
                <View>
                  <Text className="text-xs text-slate-400">
                    TIME
                  </Text>

                  <Text className="mt-1 text-lg font-bold text-slate-800">
                    {totalEstimatedTime} min
                  </Text>
                </View>

              </View>
            </View>

            {/* Route Progress */}
            <View className="mx-5 mt-4 rounded-2xl bg-white p-5">

              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="text-lg font-bold text-slate-900">
                    Route Progress
                  </Text>

                  <Text className="mt-1 text-sm text-slate-500">
                    {completedDeliveries} of {deliveries.length} deliveries completed
                  </Text>
                </View>

                <Text className="text-xl font-bold text-blue-700">
                  {progressPercentage}%
                </Text>
              </View>

              {/* Progress Bar */}
              <View className="mt-4 h-3 overflow-hidden rounded-full bg-slate-200">
                <View
                  className="h-full rounded-full bg-blue-700"
                  style={{
                    width: `${progressPercentage}%`,
                  }}
                />
              </View>

            </View>

            {/* Section Title */}
            <Text className="mx-5 mb-3 mt-5 text-lg font-bold text-slate-900">
              Delivery Stops
            </Text>
          </>
        }

        /* =========================
           EACH DELIVERY
        ========================= */
        renderItem={({ item, index }) => (
          <View className="mx-5 mb-3 rounded-2xl bg-white p-5">

            <View className="flex-row items-center">

              {/* Stop Number */}
              <View className="h-10 w-10 items-center justify-center rounded-full bg-blue-700">
                <Text className="font-bold text-white">
                  {index + 1}
                </Text>
              </View>

              {/* Customer */}
              <View className="ml-4 flex-1">
                <Text className="font-bold text-slate-900">
                  {item.customer.name}
                </Text>

                <Text className="mt-1 text-sm text-slate-500">
                  {item.customer.phone}
                </Text>
              </View>

              {/* Status */}
              <Text
                className={`text-xs font-bold ${
                  item.status === "delivered"
                    ? "text-green-600"
                    : item.status === "in_transit"
                      ? "text-blue-600"
                      : "text-orange-500"
                }`}
              >
                {item.status === "in_transit"
                  ? "IN TRANSIT"
                  : item.status.toUpperCase()}
              </Text>

            </View>

            {/* Route Information */}
            <View className="mt-4 flex-row justify-between border-t border-slate-100 pt-3">

              <Text className="flex-1 text-sm text-slate-500">
                📍 {item.pickupLocation.address}
              </Text>

              <Text className="text-sm font-semibold text-slate-700">
                {item.distance} km
              </Text>

            </View>

          </View>
        )}

        /* =========================
           BOTTOM OF LIST
        ========================= */
        ListFooterComponent={
          <Pressable
            onPress={() => {
              if (!nextDelivery) return;

              router.push({
                pathname: "/(driver)/delivery-details",
                params: {
                  id: nextDelivery._id,
                },
              });
            }}
            disabled={!nextDelivery}
            className={`mx-5 mt-2 rounded-xl py-4 ${
              nextDelivery ? "bg-blue-700" : "bg-slate-300"
            }`}
          >
            <Text className="text-center font-bold text-white">
              {nextDelivery ? "START ROUTE" : "ROUTE COMPLETED"}
            </Text>
          </Pressable>
        }

        /* =========================
           NO DELIVERIES
        ========================= */
        ListEmptyComponent={
          <View className="items-center px-5 py-20">
            <Text className="text-lg font-semibold text-slate-500">
              No deliveries assigned
            </Text>
          </View>
        }
      />

    </View>
  );
};

export default DriverRoute;