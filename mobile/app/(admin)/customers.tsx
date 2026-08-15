import { Pressable, ScrollView, Text, View } from "react-native";
import { useRouter } from "expo-router";

const AdminCustomers = () => {
  const router = useRouter();

  // Temporary data.
  // This will come from the backend later.
  const customers = [
    {
      id: "1",
      name: "Abubakar Ali",
      phone: "08012345678",
      email: "abubakar@example.com",
      orders: 5,
      status: "active",
    },
    {
      id: "2",
      name: "Musa Ibrahim",
      phone: "08023456789",
      email: "musa@example.com",
      orders: 3,
      status: "active",
    },
    {
      id: "3",
      name: "Fatima Sani",
      phone: "08034567890",
      email: "fatima@example.com",
      orders: 0,
      status: "inactive",
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
          Manage Customers
        </Text>

        <Text className="mt-1 text-blue-100">
          {customers.length} customers registered
        </Text>
      </View>

      {/* Customer List */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          padding: 20,
          paddingBottom: 120,
        }}
      >
        {customers.map((customer) => (
          <View
            key={customer.id}
            className="mb-4 rounded-2xl bg-white p-5"
          >
            {/* Customer Header */}
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-lg font-bold text-slate-900">
                  {customer.name}
                </Text>

                <Text className="mt-1 text-sm text-slate-500">
                  📞 {customer.phone}
                </Text>
              </View>

              {/* Status */}
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

            {/* Email */}
            <View className="mt-5 border-t border-slate-100 pt-4">
              <Text className="text-xs font-semibold text-slate-400">
                EMAIL
              </Text>

              <Text className="mt-1 text-slate-800">
                {customer.email}
              </Text>
            </View>

            {/* Orders + View */}
            <View className="mt-4 flex-row items-end justify-between">
              <View>
                <Text className="text-xs font-semibold text-slate-400">
                  TOTAL ORDERS
                </Text>

                <Text className="mt-1 font-bold text-slate-800">
                  {customer.orders}
                </Text>
              </View>

              <Pressable
                onPress={() =>
                  router.push({
                    pathname: "/(admin)/customer-details",
                    params: {
                      id: customer.id,
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

export default AdminCustomers;