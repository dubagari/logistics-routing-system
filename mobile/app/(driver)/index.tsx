import { Text, View, Pressable } from "react-native";
import { router } from "expo-router";
import { useAppSelector } from "../../hooks/redux";

const DriverDashboard = () => {
  const deliveries = useAppSelector(
    (state) => state.deliveries.deliveries
  );

 
  // Statistics
  const totalDeliveries = deliveries.length;

  const pendingDeliveries = deliveries.filter(
    (delivery) => delivery.status === "pending"
  ).length;

  const completedDeliveries = deliveries.filter(
    (delivery) => delivery.status === "delivered"
  ).length;

  return (
    <View className="flex-1 bg-slate-100">
      {/* Header */}
      <View className="bg-blue-700 px-5 pb-10 pt-14">
        <Text className="text-sm text-blue-100">
          Good morning 👋
        </Text>

        <Text className="mt-1 text-2xl font-bold text-white">
          Driver Dashboard
        </Text>

        <Text className="mt-1 text-blue-100">
          Ready for today's deliveries?
        </Text>
      </View>

      {/* Statistics */}
    {/* Statistics */}
<View className="-mt-5 mx-5 flex-row gap-3">

  {/* Total */}
  <Pressable
    onPress={() => router.push("/(driver)/deliveries")}
    className="flex-1 rounded-2xl bg-white p-4 shadow-sm"
  >
    <Text className="text-2xl font-bold text-slate-900">
      {totalDeliveries}
    </Text>

    <Text className="mt-1 text-sm text-slate-500">
      Total
    </Text>
  </Pressable>

  {/* Pending */}
  <View className="flex-1 rounded-2xl bg-white p-4 shadow-sm">
    <Text className="text-2xl font-bold text-orange-500">
      {pendingDeliveries}
    </Text>

    <Text className="mt-1 text-sm text-slate-500">
      Pending
    </Text>
  </View>

  {/* Done */}
  <View className="flex-1 rounded-2xl bg-white p-4 shadow-sm">
    <Text className="text-2xl font-bold text-green-600">
      {completedDeliveries}
    </Text>

    <Text className="mt-1 text-sm text-slate-500">
      Done
    </Text>
  </View>

</View>

      {/* Current Location */}
      <View className="mx-5 mt-6 rounded-2xl bg-white p-5">
        <Text className="text-lg font-bold text-slate-900">
          📍 Current Location
        </Text>

        <View className="mt-4 h-40 items-center justify-center rounded-xl bg-slate-200">
          <Text className="text-slate-500">
            Map will appear here
          </Text>
        </View>
      </View>

      {/* Route */}
      <View className="mx-5 mt-5 rounded-2xl bg-white p-5">
        <Text className="text-lg font-bold text-slate-900">
          Today's Route
        </Text>

        <Text className="mt-3 text-slate-600">
          Warehouse → Customer A → Customer B → Customer C
        </Text>

        <View className="mt-4 flex-row justify-between">
          <View>
            <Text className="text-xs text-slate-400">
              Distance
            </Text>

            <Text className="font-semibold text-slate-800">
              24.5 km
            </Text>
          </View>

          <View>
            <Text className="text-xs text-slate-400">
              Estimated Time
            </Text>

            <Text className="font-semibold text-slate-800">
              42 min
            </Text>
          </View>
        </View>

        <Pressable className="mt-5 rounded-xl bg-blue-700 py-4">
          <Text className="text-center font-bold text-white">
            START ROUTE
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default DriverDashboard;