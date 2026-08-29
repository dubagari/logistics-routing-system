import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

import { useEffect } from "react";
import { useRouter } from "expo-router";

import {
  useAppDispatch,
  useAppSelector,
} from "../../hooks/redux";

import {
  fetchCustomerDeliveries,
} from "../../store/slices/deliverySlice";

const CustomerTracking = () => {
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

  const activeDeliveries =
    deliveries.filter(
      (delivery) =>
        delivery.status === "assigned" ||
        delivery.status === "accepted" ||
        delivery.status === "in_transit"
    );

  return (
    <View className="flex-1 bg-slate-100">

      {/* HEADER */}

      <View className="bg-blue-700 px-5 pb-7 pt-14">

        <Text className="text-2xl font-bold text-white">
          Tracking
        </Text>

        <Text className="mt-1 text-blue-100">
          Track your active deliveries
        </Text>

      </View>

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

        {/* NO ACTIVE DELIVERY */}

        {!loading &&
          !error &&
          activeDeliveries.length === 0 && (
            <View className="rounded-2xl bg-white p-8">

              <Text className="text-center text-lg font-bold text-slate-800">
                No Active Deliveries
              </Text>

              <Text className="mt-2 text-center text-slate-500">
                Your active deliveries will appear here.
              </Text>

            </View>
          )}

        {/* ACTIVE DELIVERIES */}

        {!loading &&
          activeDeliveries.map((delivery) => (

            <View
              key={delivery._id}
              className="mb-5 rounded-2xl bg-white p-5"
            >

              {/* STATUS */}

              <View className="flex-row items-center justify-between">

                <View>

                  <Text className="text-xs font-semibold text-slate-400">
                    CURRENT STATUS
                  </Text>

                  <Text className="mt-1 text-xl font-bold text-blue-700">
                    {delivery.status
                      .replace("_", " ")
                      .toUpperCase()}
                  </Text>

                </View>

                <View className="h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                  <Text className="text-xl">
                    🚚
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

              {/* INFORMATION */}

              <View className="mt-5 flex-row justify-between border-t border-slate-100 pt-4">

                <View>

                  <Text className="text-xs text-slate-400">
                    DISTANCE
                  </Text>

                  <Text className="mt-1 font-bold text-slate-800">
                    {delivery.distance || 0} km
                  </Text>

                </View>

                <View>

                  <Text className="text-xs text-slate-400">
                    ETA
                  </Text>

                  <Text className="mt-1 font-bold text-slate-800">
                    {delivery.estimatedTime || 0} min
                  </Text>

                </View>

              </View>

              {/* TRACK BUTTON */}

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
                className="mt-5 rounded-xl bg-blue-700 py-4"
              >

                <Text className="text-center font-bold text-white">
                  TRACK DELIVERY
                </Text>

              </Pressable>

            </View>

          ))}

      </ScrollView>

    </View>
  );
};

export default CustomerTracking;