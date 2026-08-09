import { Text, View, Pressable, ScrollView } from "react-native";
import { useAppSelector } from "../../hooks/redux";

const Deliveries = () => {
  const deliveries = useAppSelector(
    (state) => state.deliveries.deliveries
  );

  return (
    <ScrollView className="flex-1 bg-slate-100">
      {/* Header */}
      <View className="bg-blue-700 px-5 pb-6 pt-14">
        <Text className="text-2xl font-bold text-white">
          Today's Deliveries
        </Text>

        <Text className="mt-1 text-blue-100">
          {deliveries.length} deliveries assigned to you
        </Text>
      </View>

      {/* Delivery List */}
      <View className="p-5">
        {deliveries.map((delivery) => (
          <View
            key={delivery.id}
            className="mb-4 rounded-2xl bg-white p-5"
          >
            <View className="flex-row items-center justify-between">
              <Text className="text-lg font-bold text-slate-900">
                {delivery.orderNumber}
              </Text>

              <Text className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-600">
                {delivery.status}
              </Text>
            </View>

            <Text className="mt-4 text-base font-semibold text-slate-800">
              {delivery.customerName}
            </Text>

            <Text className="mt-1 text-slate-500">
              📞 {delivery.customerPhone}
            </Text>

            <View className="my-4 h-px bg-slate-200" />

            <Text className="text-sm text-slate-400">
              Pickup
            </Text>

            <Text className="mt-1 font-medium text-slate-800">
              {delivery.pickupLocation}
            </Text>

            <Text className="mt-3 text-sm text-slate-400">
              Delivery
            </Text>

            <Text className="mt-1 font-medium text-slate-800">
              {delivery.deliveryLocation}
            </Text>

            <View className="mt-4 flex-row justify-between">
              <View>
                <Text className="text-xs text-slate-400">
                  Distance
                </Text>

                <Text className="mt-1 font-semibold text-slate-800">
                  {delivery.distance} km
                </Text>
              </View>

              <View>
                <Text className="text-xs text-slate-400">
                  Estimated Time
                </Text>

                <Text className="mt-1 font-semibold text-slate-800">
                  {delivery.estimatedTime} min
                </Text>
              </View>
            </View>

            <Pressable className="mt-5 rounded-xl bg-blue-700 py-4">
              <Text className="text-center font-bold text-white">
                VIEW DETAILS
              </Text>
            </Pressable>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default Deliveries;