import { Pressable, ScrollView, Text, View } from "react-native";
import { useRouter } from "expo-router";

const AdminProfile = () => {
  const router = useRouter();

  // Temporary admin data.
  // Later this will come from the authenticated user.
  const admin = {
    name: "System Administrator",
    email: "admin@example.com",
    phone: "08000000000",
    role: "Administrator",
  };

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
          Admin Profile
        </Text>

        <Text className="mt-1 text-blue-100">
          Manage your account
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

        {/* Profile Card */}
        <View className="items-center rounded-2xl bg-white p-6">

          {/* Avatar */}
          <View className="h-24 w-24 items-center justify-center rounded-full bg-blue-100">
            <Text className="text-4xl">
              👤
            </Text>
          </View>

          <Text className="mt-4 text-xl font-bold text-slate-900">
            {admin.name}
          </Text>

          <View className="mt-2 rounded-full bg-blue-100 px-4 py-1">
            <Text className="text-xs font-bold text-blue-700">
              {admin.role.toUpperCase()}
            </Text>
          </View>

        </View>

        {/* Account Information */}
        <View className="mt-5 rounded-2xl bg-white p-5">

          <Text className="text-lg font-bold text-slate-900">
            Account Information
          </Text>

          <View className="mt-5">

            <Text className="text-xs font-semibold text-slate-400">
              FULL NAME
            </Text>

            <Text className="mt-1 text-base font-semibold text-slate-800">
              {admin.name}
            </Text>

          </View>

          <View className="mt-4">

            <Text className="text-xs font-semibold text-slate-400">
              EMAIL
            </Text>

            <Text className="mt-1 text-base text-slate-800">
              {admin.email}
            </Text>

          </View>

          <View className="mt-4">

            <Text className="text-xs font-semibold text-slate-400">
              PHONE
            </Text>

            <Text className="mt-1 text-base text-slate-800">
              📞 {admin.phone}
            </Text>

          </View>

        </View>

        {/* Actions */}
        <View className="mt-5">

          <Pressable
            onPress={() => {}}
            className="rounded-xl bg-blue-700 py-4"
          >
            <Text className="text-center font-bold text-white">
              EDIT PROFILE
            </Text>
          </Pressable>

          <Pressable
            onPress={() => {}}
            className="mt-3 rounded-xl bg-slate-800 py-4"
          >
            <Text className="text-center font-bold text-white">
              CHANGE PASSWORD
            </Text>
          </Pressable>

          <Pressable
            onPress={() => {}}
            className="mt-3 rounded-xl border border-red-200 bg-red-50 py-4"
          >
            <Text className="text-center font-bold text-red-600">
              LOGOUT
            </Text>
          </Pressable>

        </View>

      </ScrollView>
    </View>
  );
};

export default AdminProfile;