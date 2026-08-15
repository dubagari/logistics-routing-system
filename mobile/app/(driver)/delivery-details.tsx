import { Text, View, Pressable, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useAppSelector } from "../../hooks/redux";
import { updateDeliveryStatus } from "../../store/slices/deliverySlice";
import { useAppDispatch } from "../../hooks/redux";

const DeliveryDetails = () => {
  const router = useRouter();

  const dispatch = useAppDispatch();

  const { id } = useLocalSearchParams<{ id: string }>();

  const delivery = useAppSelector((state) =>
    state.deliveries.deliveries.find(
      (item) => item.id === id
    )
  );

  // Delivery not found
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
    <ScrollView className="flex-1 bg-slate-100">
      {/* Header */}
      <View className="bg-blue-700 px-5 pb-7 pt-14">
        <Pressable onPress={() => router.back()}>
          <Text className="text-base font-semibold text-blue-100">
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

      {/* Status */}
      <View className="mx-5 -mt-4 rounded-2xl bg-white p-5">
        <Text className="text-sm text-slate-400">
          STATUS
        </Text>

        <Text className="mt-1 text-xl font-bold capitalize text-slate-900">
          {delivery.status.replace("_", " ")}
        </Text>
      </View>

      {/* Customer */}
      <View className="mx-5 mt-5 rounded-2xl bg-white p-5">
        <Text className="text-lg font-bold text-slate-900">
          Customer
        </Text>

        <Text className="mt-4 text-base font-semibold text-slate-800">
          {delivery.customerName}
        </Text>

        <Text className="mt-2 text-slate-500">
          📞 {delivery.customerPhone}
        </Text>
      </View>

      {/* Locations */}
      <View className="mx-5 mt-5 rounded-2xl bg-white p-5">
        <Text className="text-lg font-bold text-slate-900">
          Locations
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
      <View className="mx-5 mt-5 rounded-2xl bg-white p-5">
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

      {/* Action */}
      <View className="mx-5 my-6">
   {delivery.status === "pending" && (
  <Pressable
    onPress={() => {
      dispatch(
        updateDeliveryStatus({
          id: delivery.id,
          status: "in_transit",
        })
      );
    }}
    className="rounded-xl bg-blue-700 py-4"
  >
    <Text className="text-center font-bold text-white">
      START DELIVERY
    </Text>
  </Pressable>
)}

{delivery.status === "in_transit" && (
  <Pressable
    onPress={() => {
      dispatch(
        updateDeliveryStatus({
          id: delivery.id,
          status: "delivered",
        })
      );
    }}
    className="rounded-xl bg-green-600 py-4"
  >
    <Text className="text-center font-bold text-white">
      COMPLETE DELIVERY
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
  );
};

export default DeliveryDetails;