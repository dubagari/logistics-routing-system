import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

import { useRouter } from "expo-router";

import {
  useAppDispatch,
  useAppSelector,
} from "../../hooks/redux";

import {
  fetchCustomerDeliveries,
} from "../../store/slices/deliverySlice";

import { useEffect } from "react";

const CustomerOrders = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { token } = useAppSelector(
    (state) => state.auth
  );

  const {
    deliveries,
    loading,
    error,
  } = useAppSelector(
    (state) => state.deliveries
  );

  useEffect(() => {
    if (token) {
      dispatch(
        fetchCustomerDeliveries(token)
      );
    }
  }, [token, dispatch]);

  return (
    <View className="flex-1 bg-slate-100">

      {/* HEADER */}

      <View className="bg-blue-700 px-5 pb-7 pt-14">

        <Text className="text-2xl font-bold text-white">
          My Deliveries
        </Text>

        <Text className="mt-1 text-blue-100">
          {deliveries.length} deliveries
        </Text>

      </View>

      {/* CONTENT */}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          padding: 20,
          paddingBottom: 120,
        }}
      >

        {/* LOADING */}

        {loading && (
          <View className="items-center py-10">

            <ActivityIndicator
              size="large"
              color="#1d4ed8"
            />

            <Text className="mt-3 text-slate-500">
              Loading deliveries...
            </Text>

          </View>
        )}

        {/* ERROR */}

        {!loading && error && (
          <View className="rounded-2xl bg-red-50 p-5">

            <Text className="text-center font-semibold text-red-600">
              {error}
            </Text>

          </View>
        )}

        {/* EMPTY */}

        {!loading &&
          !error &&
          deliveries.length === 0 && (
            <View className="rounded-2xl bg-white p-8">

              <Text className="text-center text-lg font-bold text-slate-800">
                No deliveries yet
              </Text>

              <Text className="mt-2 text-center text-slate-500">
                Your delivery orders will appear here.
              </Text>

            </View>
          )}

        {/* DELIVERIES */}

        {!loading &&
          deliveries.map((delivery) => (

            <View
              key={delivery._id}
              className="mb-4 rounded-2xl bg-white p-5"
            >

              {/* HEADER */}

              <View className="flex-row items-center justify-between">

                <View className="flex-1">

                  <Text className="text-lg font-bold text-slate-900">
                    Delivery
                  </Text>

                  <Text className="mt-1 text-xs text-slate-400">
                    #{delivery._id}
                  </Text>

                </View>

                {/* STATUS */}

                <View
                  className={`rounded-full px-3 py-1 ${
                    delivery.status === "pending"
                      ? "bg-orange-100"
                      : delivery.status ===
                        "in_transit"
                        ? "bg-blue-100"
                        : delivery.status ===
                          "delivered"
                          ? "bg-green-100"
                          : "bg-slate-100"
                  }`}
                >

                  <Text
                    className={`text-xs font-bold ${
                      delivery.status === "pending"
                        ? "text-orange-600"
                        : delivery.status ===
                          "in_transit"
                          ? "text-blue-600"
                          : delivery.status ===
                            "delivered"
                            ? "text-green-600"
                            : "text-slate-600"
                    }`}
                  >
                    {delivery.status
                      .replace("_", " ")
                      .toUpperCase()}
                  </Text>

                </View>

              </View>

              {/* ROUTE */}

              <View className="mt-5 border-t border-slate-100 pt-4">

                <Text className="text-xs font-semibold text-slate-400">
                  ROUTE
                </Text>

                <Text className="mt-2 text-sm text-slate-700">
                  📍 {delivery.pickupLocation.address}
                </Text>

                <Text className="mt-2 text-sm text-slate-700">
                  📍 {delivery.deliveryLocation.address}
                </Text>

              </View>

              {/* PACKAGE */}

              <View className="mt-4">

                <Text className="text-xs font-semibold text-slate-400">
                  PACKAGE
                </Text>

                <Text className="mt-1 font-semibold text-slate-800">
                  {delivery.packageDescription}
                </Text>

              </View>

              {/* INFORMATION */}

              <View className="mt-4 flex-row justify-between border-t border-slate-100 pt-4">

                <View>
                  <Text className="text-xs text-slate-400">
                    DISTANCE
                  </Text>

                  <Text className="mt-1 font-semibold text-slate-800">
                    {delivery.distance || 0} km
                  </Text>
                </View>

                <View>
                  <Text className="text-xs text-slate-400">
                    TIME
                  </Text>

                  <Text className="mt-1 font-semibold text-slate-800">
                    {delivery.estimatedTime || 0} min
                  </Text>
                </View>

              </View>

              {/* ACTIONS */}

              <View className="mt-5 flex-row gap-3">

                <Pressable
                  onPress={() =>
                    router.push(`/(customer)/create/${delivery._id}`)
                  }
                  className="flex-1 rounded-xl bg-blue-700 py-3"
                >

                  <Text className="text-center font-bold text-white">
                    VIEW ORDER
                  </Text>

                </Pressable>

                {(delivery.status ===
                  "accepted" ||
                  delivery.status ===
                    "in_transit") && (

                  <Pressable
                    onPress={() =>
                      router.push({
                        pathname:
                          "/(customer)/track-delivery",
                        params: {
                          id: delivery._id,
                        },
                      })
                    }
                    className="flex-1 rounded-xl bg-green-600 py-3"
                  >

                    <Text className="text-center font-bold text-white">
                      TRACK
                    </Text>

                  </Pressable>

                )}

              </View>

            </View>

          ))}

      </ScrollView>

    </View>
  );
};

export default CustomerOrders;