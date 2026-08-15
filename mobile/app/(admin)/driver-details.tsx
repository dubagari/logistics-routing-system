import { Pressable, ScrollView, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

const AdminDriverDetails = () => {
  const router = useRouter();

  const { id } = useLocalSearchParams<{ id: string }>();

  // Temporary data.
  // This will come from the backend later.
  const drivers = [
    {
      id: "1",
      name: "Ahmed Musa",
      phone: "08012345678",
      email: "ahmed@example.com",
      vehicle: "Toyota Hiace",
      plateNumber: "ABC-123-AB",
      status: "active",
      deliveries: 5,
      completed: 3,
      pending: 2,
    },
    {
      id: "2",
      name: "Musa Ibrahim",
      phone: "08023456789",
      email: "musa@example.com",
      vehicle: "Honda Accord",
      plateNumber: "KJA-456-CD",
      status: "active",
      deliveries: 3,
      completed: 2,
      pending: 1,
    },
    {
      id: "3",
      name: "Abdullahi Sani",
      phone: "08034567890",
      email: "abdullahi@example.com",
      vehicle: "Toyota Corolla",
      plateNumber: "RBC-789-EF",
      status: "offline",
      deliveries: 0,
      completed: 0,
      pending: 0,
    },
  ];

  const driver = drivers.find((item) => item.id === id);

  // Driver not found
  if (!driver) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-100 px-5">
        <Text className="text-xl font-bold text-slate-900">
          Driver not found
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
    <View className="flex-1 bg-slate-100">

      {/* Fixed Header */}
      <View className="bg-blue-700 px-5 pb-7 pt-14">

        <Pressable onPress={() => router.back()}>
          <Text className="font-semibold text-white">
            ← Back
          </Text>
        </Pressable>

        <Text className="mt-5 text-2xl font-bold text-white">
          Driver Details
        </Text>

        <Text className="mt-1 text-blue-100">
          {driver.name}
        </Text>

      </View>

      {/* Scrollable Content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          padding: 20,
          paddingBottom: 120,
        }}
      >

        {/* Driver Information */}
        <View className="rounded-2xl bg-white p-5">

          <Text className="text-lg font-bold text-slate-900">
            Driver Information
          </Text>

          <View className="mt-5">

            <Text className="text-xs font-semibold text-slate-400">
              FULL NAME
            </Text>

            <Text className="mt-1 text-base font-semibold text-slate-800">
              {driver.name}
            </Text>

          </View>

          <View className="mt-4">

            <Text className="text-xs font-semibold text-slate-400">
              PHONE
            </Text>

            <Text className="mt-1 text-base text-slate-800">
              📞 {driver.phone}
            </Text>

          </View>

          <View className="mt-4">

            <Text className="text-xs font-semibold text-slate-400">
              EMAIL
            </Text>

            <Text className="mt-1 text-base text-slate-800">
              {driver.email}
            </Text>

          </View>

          {/* Status */}
          <View className="mt-5 flex-row items-center justify-between border-t border-slate-100 pt-4">

            <Text className="text-xs font-semibold text-slate-400">
              STATUS
            </Text>

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

        </View>

        {/* Vehicle */}
        <View className="mt-5 rounded-2xl bg-white p-5">

          <Text className="text-lg font-bold text-slate-900">
            Vehicle Information
          </Text>

          <View className="mt-5">

            <Text className="text-xs font-semibold text-slate-400">
              VEHICLE
            </Text>

            <Text className="mt-1 text-base font-semibold text-slate-800">
              🚚 {driver.vehicle}
            </Text>

          </View>

          <View className="mt-4">

            <Text className="text-xs font-semibold text-slate-400">
              PLATE NUMBER
            </Text>

            <Text className="mt-1 text-base font-semibold text-slate-800">
              {driver.plateNumber}
            </Text>

          </View>

        </View>

        {/* Delivery Statistics */}
        <View className="mt-5 rounded-2xl bg-white p-5">

          <Text className="text-lg font-bold text-slate-900">
            Delivery Statistics
          </Text>

          <View className="mt-5 flex-row justify-between">

            <View>
              <Text className="text-xs text-slate-400">
                TOTAL
              </Text>

              <Text className="mt-1 text-xl font-bold text-slate-800">
                {driver.deliveries}
              </Text>
            </View>

            <View>
              <Text className="text-xs text-slate-400">
                COMPLETED
              </Text>

              <Text className="mt-1 text-xl font-bold text-green-600">
                {driver.completed}
              </Text>
            </View>

            <View>
              <Text className="text-xs text-slate-400">
                PENDING
              </Text>

              <Text className="mt-1 text-xl font-bold text-orange-500">
                {driver.pending}
              </Text>
            </View>

          </View>

        </View>

        {/* Actions */}
        <View className="mt-5">

          <Pressable
            onPress={() => {}}
            className="rounded-xl bg-blue-700 py-4"
          >
            <Text className="text-center font-bold text-white">
              VIEW DELIVERIES
            </Text>
          </Pressable>

          <Pressable
            onPress={() => {}}
            className="mt-3 rounded-xl bg-slate-800 py-4"
          >
            <Text className="text-center font-bold text-white">
              CONTACT DRIVER
            </Text>
          </Pressable>

        </View>

      </ScrollView>

    </View>
  );
};

export default AdminDriverDetails;