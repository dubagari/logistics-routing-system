import { Pressable, ScrollView, Text, View } from "react-native";
import { useRouter } from "expo-router";

const AdminDrivers = () => {
  const router = useRouter();

  // Temporary driver data.
  // Later this will come from the backend.
  const drivers = [
    {
      id: "1",
      name: "Ahmed Musa",
      phone: "08012345678",
      vehicle: "Toyota Hiace",
      status: "active",
      deliveries: 5,
    },
    {
      id: "2",
      name: "Musa Ibrahim",
      phone: "08023456789",
      vehicle: "Honda Accord",
      status: "active",
      deliveries: 3,
    },
    {
      id: "3",
      name: "Abdullahi Sani",
      phone: "08034567890",
      vehicle: "Toyota Corolla",
      status: "offline",
      deliveries: 0,
    },
  ];

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
          Manage Drivers
        </Text>

        <Text className="mt-1 text-blue-100">
          {drivers.length} drivers registered
        </Text>
      </View>

      {/* Driver List */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          padding: 20,
          paddingBottom: 120,
        }}
      >
        {drivers.map((driver) => (
          <View
            key={driver.id}
            className="mb-4 rounded-2xl bg-white p-5"
          >
            {/* Driver Header */}
            <View className="flex-row items-center justify-between">

              <View className="flex-1">
                <Text className="text-lg font-bold text-slate-900">
                  {driver.name}
                </Text>

                <Text className="mt-1 text-sm text-slate-500">
                  📞 {driver.phone}
                </Text>
              </View>

              {/* Status */}
              <View
                className={`rounded-full px-3 py-1 ${
                  driver.status === "active"
                    ? "bg-green-100"
                    : "bg-slate-100"
                }`}
              >
                <Text
                  className={`text-xs font-bold ${
                    driver.status === "active"
                      ? "text-green-600"
                      : "text-slate-500"
                  }`}
                >
                  {driver.status.toUpperCase()}
                </Text>
              </View>

            </View>

            {/* Vehicle */}
            <View className="mt-5 border-t border-slate-100 pt-4">

              <Text className="text-xs font-semibold text-slate-400">
                VEHICLE
              </Text>

              <Text className="mt-1 font-semibold text-slate-800">
                🚚 {driver.vehicle}
              </Text>

            </View>

            {/* Deliveries */}
            <View className="mt-4 flex-row justify-between">

              <View>
                <Text className="text-xs text-slate-400">
                  ASSIGNED DELIVERIES
                </Text>

                <Text className="mt-1 font-bold text-slate-800">
                  {driver.deliveries}
                </Text>
              </View>

              {/* View Button */}
           <Pressable
  onPress={() =>
    router.push({
      pathname: "/(admin)/driver-details",
      params: {
        id: driver.id,
      },
    })
  }
  className="rounded-xl bg-blue-700 px-5 py-3"
>
  <Text className="font-bold text-white">
    VIEW
  </Text>
</Pressable>

            </View>

          </View>
        ))}
      </ScrollView>

    </View>
  );
};

export default AdminDrivers;