import { FlatList, Pressable, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useAppSelector } from "../../hooks/redux";

const Deliveries = () => {
  const router = useRouter();

  const deliveries = useAppSelector(
    (state) => state.deliveries.deliveries
  );

  return (
    <View className="flex-1 bg-slate-100">
      {/* Header */}
      <View className="bg-blue-700 px-5 pb-6 pt-14">
        <Text className="text-3xl font-bold text-white">
          My Deliveries
        </Text>

        <Text className="mt-1 text-blue-100">
          {deliveries.length} deliveries assigned
        </Text>
      </View>

      {/* Delivery List */}
      <FlatList
        data={deliveries}
        keyExtractor={(item) => item.id}
       
        showsVerticalScrollIndicator={false}
         contentContainerStyle={{
          paddingBottom: 110,
        }}
        renderItem={({ item }) => (
          <Pressable
            onPress={() =>
              router.push({
                pathname: "/(driver)/delivery-details",
                params: {
                  id: item.id,
                },
              })
            }
            className="mb-4 rounded-2xl bg-white p-5"
          >
            {/* Order number */}
            <View className="flex-row items-center justify-between">
              <Text className="text-lg font-bold text-slate-900">
                {item.orderNumber}
              </Text>

              {/* Status */}
              <View
                className={`rounded-full px-3 py-1 ${
                  item.status === "pending"
                    ? "bg-orange-100"
                    : item.status === "in_transit"
                      ? "bg-blue-100"
                      : "bg-green-100"
                }`}
              >
                <Text
                  className={`text-xs font-bold ${
                    item.status === "pending"
                      ? "text-orange-600"
                      : item.status === "in_transit"
                        ? "text-blue-600"
                        : "text-green-600"
                  }`}
                >
                  {item.status === "in_transit"
                    ? "IN TRANSIT"
                    : item.status.toUpperCase()}
                </Text>
              </View>
            </View>

            {/* Customer */}
            <Text className="mt-4 text-base font-semibold text-slate-800">
              {item.customerName}
            </Text>

            <Text className="mt-1 text-sm text-slate-500">
              📞 {item.customerPhone}
            </Text>

            {/* Locations */}
            <View className="mt-4">
              <Text className="text-sm text-slate-400">
                Pickup
              </Text>

              <Text className="mt-1 text-slate-700">
                📍 {item.pickupLocation}
              </Text>

              <Text className="mt-3 text-sm text-slate-400">
                Delivery
              </Text>

              <Text className="mt-1 text-slate-700">
                📍 {item.deliveryLocation}
              </Text>
            </View>

            {/* Distance / Time */}
            <View className="mt-5 flex-row justify-between border-t border-slate-100 pt-4">
              <View>
                <Text className="text-xs text-slate-400">
                  Distance
                </Text>

                <Text className="mt-1 font-semibold text-slate-800">
                  {item.distance} km
                </Text>
              </View>

              <View>
                <Text className="text-xs text-slate-400">
                  Estimated Time
                </Text>

                <Text className="mt-1 font-semibold text-slate-800">
                  {item.estimatedTime} min
                </Text>
              </View>

              <Text className="self-end font-bold text-blue-700">
                View →
              </Text>
            </View>
          </Pressable>
        )}
        ListEmptyComponent={
          <View className="items-center py-20">
            <Text className="text-lg font-semibold text-slate-500">
              No deliveries found
            </Text>
          </View>
        }
      />
    </View>
  );
};

export default Deliveries;