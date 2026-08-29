
// import {
//   View,
//   Text,
//   Pressable,
//   ScrollView,
// } from "react-native";

// import { useRouter } from "expo-router";

// import {
//   useAppSelector,
// } from "../../hooks/redux";

// const CustomerDashboard = () => {
//   const router = useRouter();

//   const { user } = useAppSelector(
//     (state) => state.auth
//   );

//   return (
//     <View className="flex-1 bg-slate-100">

//       {/* HEADER */}
//       <View className="bg-blue-700 px-5 pb-7 pt-14">

//         <Text className="text-sm text-blue-100">
//           Welcome back
//         </Text>

//         <Text className="mt-1 text-2xl font-bold text-white">
//           {user?.name || "Customer"}
//         </Text>

//         <Text className="mt-1 text-blue-100">
//           Manage your deliveries
//         </Text>

//       </View>

//       <ScrollView
//         className="flex-1"
//         contentContainerStyle={{
//           padding: 20,
//           paddingBottom: 40,
//         }}
//         showsVerticalScrollIndicator={false}
//       >

//         {/* CREATE DELIVERY */}
//         <Pressable
//           onPress={() =>
//             router.push(
//               "/(customer)/create-delivery"
//             )
//           }
//           className="rounded-2xl bg-white p-5"
//         >

//           <View className="flex-row items-center justify-between">

//             <View className="flex-1">

//               <Text className="text-xl font-bold text-slate-900">
//                 Create a Delivery
//               </Text>

//               <Text className="mt-1 text-sm text-slate-500">
//                 Send a package to another location
//               </Text>

//             </View>

//             <View className="rounded-full bg-blue-100 px-4 py-3">
//               <Text className="text-xl">
//                 +
//               </Text>
//             </View>

//           </View>

//         </Pressable>

//         {/* ACTIVE DELIVERIES */}
//         <View className="mt-6">

//           <Text className="text-lg font-bold text-slate-900">
//             Active Deliveries
//           </Text>

//           <View className="mt-3 rounded-2xl bg-white p-5">

//             <Text className="text-center text-slate-500">
//               No active deliveries
//             </Text>

//           </View>

//         </View>

//         {/* RECENT DELIVERIES */}
//         <View className="mt-6">

//           <Text className="text-lg font-bold text-slate-900">
//             Recent Deliveries
//           </Text>

//           <View className="mt-3 rounded-2xl bg-white p-5">

//             <Text className="text-center text-slate-500">
//               No recent deliveries
//             </Text>

//           </View>

//         </View>

//       </ScrollView>

//     </View>
//   );
// };

// export default CustomerDashboard;



import {
  View,
  Text,
  Pressable,
  ScrollView,
  ActivityIndicator,
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

  const {
    deliveries,
    loading,
  } = useAppSelector(
    (state) => state.deliveries
  );

  // ============================================
  // ACTIVE DELIVERIES
  // ============================================

  const activeDeliveries =
    deliveries.filter((delivery) =>
      [
        "pending",
        "assigned",
        "accepted",
        "in_transit",
      ].includes(delivery.status)
    );

  // ============================================
  // RECENT DELIVERIES
  // ============================================

  const recentDeliveries =
    deliveries.filter((delivery) =>
      [
        "delivered",
        "cancelled",
      ].includes(delivery.status)
    );

  // ============================================
  // STATUS LABEL
  // ============================================

  const getStatusLabel = (
    status: string
  ) => {
    switch (status) {
      case "pending":
        return "PENDING";

      case "assigned":
        return "DRIVER ASSIGNED";

      case "accepted":
        return "ACCEPTED";

      case "in_transit":
        return "IN TRANSIT";

      case "delivered":
        return "DELIVERED";

      case "cancelled":
        return "CANCELLED";

      default:
        return status.toUpperCase();
    }
  };

  // ============================================
  // STATUS COLOR
  // ============================================

  const getStatusStyle = (
    status: string
  ) => {
    switch (status) {
      case "pending":
        return {
          container: "bg-orange-100",
          text: "text-orange-600",
        };

      case "assigned":
        return {
          container: "bg-purple-100",
          text: "text-purple-600",
        };

      case "accepted":
        return {
          container: "bg-blue-100",
          text: "text-blue-600",
        };

      case "in_transit":
        return {
          container: "bg-blue-100",
          text: "text-blue-600",
        };

      case "delivered":
        return {
          container: "bg-green-100",
          text: "text-green-600",
        };

      case "cancelled":
        return {
          container: "bg-red-100",
          text: "text-red-600",
        };

      default:
        return {
          container: "bg-slate-100",
          text: "text-slate-600",
        };
    }
  };

  return (
    <View className="flex-1 bg-slate-100">

      {/* ====================================== */}
      {/* HEADER */}
      {/* ====================================== */}

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

        {/* ==================================== */}
        {/* CREATE DELIVERY */}
        {/* ==================================== */}

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

        {/* ==================================== */}
        {/* ACTIVE DELIVERIES */}
        {/* ==================================== */}

        <View className="mt-6">

          <View className="flex-row items-center justify-between">

            <Text className="text-lg font-bold text-slate-900">
              Active Deliveries
            </Text>

            {activeDeliveries.length > 0 && (
              <Text className="text-sm font-semibold text-blue-700">
                {activeDeliveries.length}
              </Text>
            )}

          </View>

          {loading ? (

            <View className="mt-3 items-center rounded-2xl bg-white p-6">

              <ActivityIndicator
                size="small"
                color="#1d4ed8"
              />

              <Text className="mt-2 text-sm text-slate-500">
                Loading deliveries...
              </Text>

            </View>

          ) : activeDeliveries.length === 0 ? (

            <View className="mt-3 rounded-2xl bg-white p-5">

              <Text className="text-center text-slate-500">
                No active deliveries
              </Text>

            </View>

          ) : (

            activeDeliveries.map(
              (delivery) => {

                const statusStyle =
                  getStatusStyle(
                    delivery.status
                  );

                return (
                  <View
                    key={delivery._id}
                    className="mt-3 rounded-2xl bg-white p-5"
                  >

                    {/* ORDER + STATUS */}

                    <View className="flex-row items-start justify-between">

                      <View className="flex-1">

                        <Text className="text-base font-bold text-slate-900">
                          Delivery #{delivery._id.slice(-6)}
                        </Text>

                        <Text className="mt-1 text-xs text-slate-400">
                          {delivery.packageDescription}
                        </Text>

                      </View>

                      <View
                        className={`rounded-full px-3 py-1 ${statusStyle.container}`}
                      >

                        <Text
                          className={`text-xs font-bold ${statusStyle.text}`}
                        >
                          {getStatusLabel(
                            delivery.status
                          )}
                        </Text>

                      </View>

                    </View>

                    {/* ROUTE */}

                    <View className="mt-4 border-t border-slate-100 pt-4">

                      <Text className="text-xs font-semibold text-slate-400">
                        ROUTE
                      </Text>

                      <Text className="mt-2 text-sm text-slate-700">
                        📍{" "}
                        {delivery.pickupLocation.address}
                      </Text>

                      <Text className="mt-2 text-sm text-slate-700">
                        📍{" "}
                        {delivery.deliveryLocation.address}
                      </Text>

                    </View>

                    {/* DRIVER */}

                    <View className="mt-4">

                      <Text className="text-xs font-semibold text-slate-400">
                        DRIVER
                      </Text>

                      <Text className="mt-1 font-semibold text-slate-800">
                        🚚{" "}
                        {typeof delivery.driver === "object" && delivery.driver
                          ? (delivery.driver as any).fullName ||
                            delivery.driver.name ||
                            "Driver assigned"
                          : "Not assigned"}
                      </Text>

                    </View>

                    {/* DISTANCE / ETA */}

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
                          EST. TIME
                        </Text>

                        <Text className="mt-1 font-semibold text-slate-800">
                          {delivery.estimatedTime || 0} min
                        </Text>

                      </View>

                    </View>

                    {/* ACTION */}

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
                      className="mt-5 rounded-xl bg-blue-700 py-3"
                    >

                      <Text className="text-center font-bold text-white">
                        TRACK DELIVERY
                      </Text>

                    </Pressable>

                  </View>
                );
              }
            )

          )}

        </View>

        {/* ==================================== */}
        {/* RECENT DELIVERIES */}
        {/* ==================================== */}

        <View className="mt-6">

          <Text className="text-lg font-bold text-slate-900">
            Recent Deliveries
          </Text>

          {recentDeliveries.length === 0 ? (

            <View className="mt-3 rounded-2xl bg-white p-5">

              <Text className="text-center text-slate-500">
                No recent deliveries
              </Text>

            </View>

          ) : (

            recentDeliveries
              .slice(0, 3)
              .map((delivery) => (

                <Pressable
                  key={delivery._id}
                  onPress={() =>
                    router.push({
                      pathname:
                        "/(customer)/track-delivery",
                      params: {
                        id: delivery._id,
                      },
                    })
                  }
                  className="mt-3 rounded-2xl bg-white p-5"
                >

                  <View className="flex-row items-center justify-between">

                    <View className="flex-1">

                      <Text className="font-bold text-slate-900">
                        Delivery #{delivery._id.slice(-6)}
                      </Text>

                      <Text className="mt-1 text-sm text-slate-500">
                        {delivery.deliveryLocation.address}
                      </Text>

                    </View>

                    <Text className="text-xs font-bold text-green-600">
                      {getStatusLabel(
                        delivery.status
                      )}
                    </Text>

                  </View>

                </Pressable>

              ))

          )}

        </View>

      </ScrollView>

    </View>
  );
};

export default CustomerDashboard;
