import {
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";

const CreateOrder = () => {
  const router = useRouter();

  const [pickupLocation, setPickupLocation] = useState("");
  const [deliveryLocation, setDeliveryLocation] = useState("");
  const [packageDescription, setPackageDescription] = useState("");
  const [phone, setPhone] = useState("");

  const handleCreateOrder = () => {
    // Backend connection will be added later.
    console.log({
      pickupLocation,
      deliveryLocation,
      packageDescription,
      phone,
    });

    router.push("/(customer)/orders");
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
          Create Order
        </Text>

        <Text className="mt-1 text-blue-100">
          Provide your delivery information
        </Text>
      </View>

      {/* Form */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          padding: 20,
          paddingBottom: 120,
        }}
      >

        {/* Pickup */}
        <View className="rounded-2xl bg-white p-5">

          <Text className="text-lg font-bold text-slate-900">
            Pickup Information
          </Text>

          <Text className="mt-5 text-xs font-semibold text-slate-400">
            PICKUP LOCATION
          </Text>

          <TextInput
            value={pickupLocation}
            onChangeText={setPickupLocation}
            placeholder="Enter pickup location"
            placeholderTextColor="#94a3b8"
            className="mt-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 text-slate-900"
          />

        </View>

        {/* Delivery */}
        <View className="mt-5 rounded-2xl bg-white p-5">

          <Text className="text-lg font-bold text-slate-900">
            Delivery Information
          </Text>

          <Text className="mt-5 text-xs font-semibold text-slate-400">
            DELIVERY LOCATION
          </Text>

          <TextInput
            value={deliveryLocation}
            onChangeText={setDeliveryLocation}
            placeholder="Enter delivery location"
            placeholderTextColor="#94a3b8"
            className="mt-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 text-slate-900"
          />

          <Text className="mt-5 text-xs font-semibold text-slate-400">
            RECIPIENT PHONE
          </Text>

          <TextInput
            value={phone}
            onChangeText={setPhone}
            placeholder="Enter recipient phone"
            placeholderTextColor="#94a3b8"
            keyboardType="phone-pad"
            className="mt-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 text-slate-900"
          />

        </View>

        {/* Package */}
        <View className="mt-5 rounded-2xl bg-white p-5">

          <Text className="text-lg font-bold text-slate-900">
            Package Information
          </Text>

          <Text className="mt-5 text-xs font-semibold text-slate-400">
            DESCRIPTION
          </Text>

          <TextInput
            value={packageDescription}
            onChangeText={setPackageDescription}
            placeholder="What are you sending?"
            placeholderTextColor="#94a3b8"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            className="mt-2 min-h-28 rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 text-slate-900"
          />

        </View>

        {/* Summary */}
        <View className="mt-5 rounded-2xl bg-white p-5">

          <Text className="text-lg font-bold text-slate-900">
            Order Summary
          </Text>

          <View className="mt-5 flex-row justify-between">
            <Text className="text-slate-500">
              Delivery fee
            </Text>

            <Text className="font-bold text-slate-800">
              Calculated later
            </Text>
          </View>

          <View className="mt-3 flex-row justify-between border-t border-slate-100 pt-3">
            <Text className="font-bold text-slate-900">
              Total
            </Text>

            <Text className="font-bold text-blue-700">
              Pending
            </Text>
          </View>

        </View>

        {/* Submit */}
        <Pressable
          onPress={handleCreateOrder}
          className="mt-5 rounded-xl bg-blue-700 py-4"
        >
          <Text className="text-center font-bold text-white">
            CREATE ORDER
          </Text>
        </Pressable>

      </ScrollView>
    </View>
  );
};

export default CreateOrder;