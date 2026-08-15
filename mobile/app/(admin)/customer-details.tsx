import { Pressable, ScrollView, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

const CustomerDetails = () => {
  const router = useRouter();

  const { id } = useLocalSearchParams<{ id: string }>();

  // Temporary data.
  // Later this will come from the backend.
  const customers = [
    {
      id: "1",
      name: "Abubakar Ali",
      phone: "08012345678",
      email: "abubakar@example.com",
      address: "Wuse, Abuja",
      status: "active",
      totalOrders: 5,
      completedOrders: 3,
      pendingOrders: 2,
    },
    {
      id: "2",
      name: "Musa Ibrahim",
      phone: "08023456789",
      email: "musa@example.com",
      address: "Garki, Abuja",
      status: "active",
      totalOrders: 3,
      completedOrders: 2,
      pendingOrders: 1,
    },
    {
      id: "3",
      name: "Fatima Sani",
      phone: "08034567890",
      email: "fatima@example.com",
      address: "Maitama, Abuja",
      status: "inactive",
      totalOrders: 0,
      completedOrders: 0,
      pendingOrders: 0,
    },
  ];

  const customer = customers.find((item) => item.id === id);

  if (!customer) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-100 px-5">
        <Text className="text-xl font-bold text-slate-900">
          Customer not found
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
          Customer Details
        </Text>

        <Text className="mt-1 text-blue-100">
          {customer.name}
        </Text>
      </View>

      {/* Content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          padding: 20,
          paddingBottom: 120,
        }}
      >

        {/* Customer Information */}
        <View className="rounded-2xl bg-white p-5">

          <Text className="text-lg font-bold text-slate-900">
            Customer Information
          </Text>

          <View className="mt-5">
            <Text className="text-xs font-semibold text-slate-400">
              FULL NAME
            </Text>

            <Text className="mt-1 text-base font-semibold text-slate-800">
              {customer.name}
            </Text>
          </View>

          <View className="mt-4">
            <Text className="text-xs font-semibold text-slate-400">
              PHONE
            </Text>

            <Text className="mt-1 text-base text-slate-800">
              📞 {customer.phone}
            </Text>
          </View>

          <View className="mt-4">
            <Text className="text-xs font-semibold text-slate-400">
              EMAIL
            </Text>

            <Text className="mt-1 text-base text-slate-800">
              {customer.email}
            </Text>
          </View>

          <View className="mt-4">
            <Text className="text-xs font-semibold text-slate-400">
              ADDRESS
            </Text>

            <Text className="mt-1 text-base text-slate-800">
              📍 {customer.address}
            </Text>
          </View>

          {/* Status */}
          <View className="mt-5 flex-row items-center justify-between border-t border-slate-100 pt-4">
            <Text className="text-xs font-semibold text-slate-400">
              ACCOUNT STATUS
            </Text>

            <View
              className={`rounded-full px-3 py-1 ${
                customer.status === "active"
                  ? "bg-green-100"
                  : "bg-slate-100"
              }`}
            >
              <Text
                className={`text-xs font-bold ${
                  customer.status === "active"
                    ? "text-green-600"
                    : "text-slate-500"
                }`}
              >
                {customer.status.toUpperCase()}
              </Text>
            </View>
          </View>

        </View>

        {/* Order Statistics */}
        <View className="mt-5 rounded-2xl bg-white p-5">

          <Text className="text-lg font-bold text-slate-900">
            Order Statistics
          </Text>

          <View className="mt-5 flex-row justify-between">

            <View>
              <Text className="text-xs text-slate-400">
                TOTAL
              </Text>

              <Text className="mt-1 text-xl font-bold text-slate-800">
                {customer.totalOrders}
              </Text>
            </View>

            <View>
              <Text className="text-xs text-slate-400">
                COMPLETED
              </Text>

              <Text className="mt-1 text-xl font-bold text-green-600">
                {customer.completedOrders}
              </Text>
            </View>

            <View>
              <Text className="text-xs text-slate-400">
                PENDING
              </Text>

              <Text className="mt-1 text-xl font-bold text-orange-500">
                {customer.pendingOrders}
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
              VIEW ORDERS
            </Text>
          </Pressable>

          <Pressable
            onPress={() => {}}
            className="mt-3 rounded-xl bg-slate-800 py-4"
          >
            <Text className="text-center font-bold text-white">
              CONTACT CUSTOMER
            </Text>
          </Pressable>

        </View>

      </ScrollView>
    </View>
  );
};

export default CustomerDetails;