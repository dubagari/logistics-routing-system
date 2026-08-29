
import {
  View,
  Text,
  Pressable,
  ScrollView,
} from "react-native";

import { useRouter } from "expo-router";

import {
  useAppSelector,
} from "../../hooks/redux";

const CustomerDashboard = () => {
  const router = useRouter();

  const { user } = useAppSelector(
    (state) => state.auth
  );

  return (
    <View className="flex-1 bg-slate-100">

      {/* HEADER */}
      <View className="bg-blue-700 px-5 pb-7 pt-14">

        <Text className="text-sm text-blue-100">
          Welcome back
        </Text>

        <Text className="mt-1 text-2xl font-bold text-white">
          {user?.name || "Customer"}
        </Text>

        <Text className="mt-1 text-blue-100">
          Manage your deliveries
        </Text>

      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          padding: 20,
          paddingBottom: 40,
        }}
        showsVerticalScrollIndicator={false}
      >

        {/* CREATE DELIVERY */}
        <Pressable
          onPress={() =>
            router.push(
              "/(customer)/create-delivery"
            )
          }
          className="rounded-2xl bg-white p-5"
        >

          <View className="flex-row items-center justify-between">

            <View className="flex-1">

              <Text className="text-xl font-bold text-slate-900">
                Create a Delivery
              </Text>

              <Text className="mt-1 text-sm text-slate-500">
                Send a package to another location
              </Text>

            </View>

            <View className="rounded-full bg-blue-100 px-4 py-3">
              <Text className="text-xl">
                +
              </Text>
            </View>

          </View>

        </Pressable>

        {/* ACTIVE DELIVERIES */}
        <View className="mt-6">

          <Text className="text-lg font-bold text-slate-900">
            Active Deliveries
          </Text>

          <View className="mt-3 rounded-2xl bg-white p-5">

            <Text className="text-center text-slate-500">
              No active deliveries
            </Text>

          </View>

        </View>

        {/* RECENT DELIVERIES */}
        <View className="mt-6">

          <Text className="text-lg font-bold text-slate-900">
            Recent Deliveries
          </Text>

          <View className="mt-3 rounded-2xl bg-white p-5">

            <Text className="text-center text-slate-500">
              No recent deliveries
            </Text>

          </View>

        </View>

      </ScrollView>

    </View>
  );
};

export default CustomerDashboard;
