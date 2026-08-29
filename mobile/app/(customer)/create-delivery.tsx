
import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  ActivityIndicator,
  Platform,
  ScrollView,
} from "react-native";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { useState } from "react";
import { useRouter } from "expo-router";
import * as Location from "expo-location";

import {
  useAppSelector,
  useAppDispatch,
} from "../../hooks/redux";

import {
  createCustomerDeliveryThunk,
} from "../../store/slices/deliverySlice";

const CreateDelivery = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { token } = useAppSelector(
    (state) => state.auth
  );

  const { creating } = useAppSelector(
    (state) => state.deliveries
  );

  // ============================================
  // FORM STATE
  // ============================================

  const [pickupAddress, setPickupAddress] =
    useState("");

  const [deliveryAddress, setDeliveryAddress] =
    useState("");

  const [deliveryLatitude, setDeliveryLatitude] =
    useState("");

  const [deliveryLongitude, setDeliveryLongitude] =
    useState("");

  const [packageDescription, setPackageDescription] =
    useState("");

  const [packageWeight, setPackageWeight] =
    useState("");

  const [notes, setNotes] =
    useState("");

  // ============================================
  // CREATE DELIVERY
  // ============================================

  const handleCreateDelivery = async () => {
    if (!token) {
      Alert.alert(
        "Authentication Error",
        "Please login again."
      );

      return;
    }

    // ========================================
    // VALIDATION
    // ========================================

    if (!pickupAddress.trim()) {
      Alert.alert(
        "Pickup Required",
        "Please enter the pickup address."
      );

      return;
    }

    if (!deliveryAddress.trim()) {
      Alert.alert(
        "Destination Required",
        "Please enter the delivery address."
      );

      return;
    }

    if (!deliveryLatitude.trim()) {
      Alert.alert(
        "Latitude Required",
        "Please enter the destination latitude."
      );

      return;
    }

    if (!deliveryLongitude.trim()) {
      Alert.alert(
        "Longitude Required",
        "Please enter the destination longitude."
      );

      return;
    }

    if (!packageDescription.trim()) {
      Alert.alert(
        "Package Required",
        "Please enter the package description."
      );

      return;
    }

    const latitude =
      Number(deliveryLatitude);

    const longitude =
      Number(deliveryLongitude);

    const weight =
      Number(packageWeight || 0);

    if (
      !Number.isFinite(latitude) ||
      latitude < -90 ||
      latitude > 90
    ) {
      Alert.alert(
        "Invalid Latitude",
        "Please enter a valid latitude."
      );

      return;
    }

    if (
      !Number.isFinite(longitude) ||
      longitude < -180 ||
      longitude > 180
    ) {
      Alert.alert(
        "Invalid Longitude",
        "Please enter a valid longitude."
      );

      return;
    }

    if (
      !Number.isFinite(weight) ||
      weight < 0
    ) {
      Alert.alert(
        "Invalid Weight",
        "Please enter a valid package weight."
      );

      return;
    }

    // ========================================
    // GET CURRENT LOCATION
    // ========================================

    try {
      const { status } =
        await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Location Permission",
          "Location permission is required to determine your pickup location."
        );

        return;
      }

      const location =
        await Location.getCurrentPositionAsync({
          accuracy:
            Location.Accuracy.Balanced,
        });

      const pickupLatitude =
        location.coords.latitude;

      const pickupLongitude =
        location.coords.longitude;

      // ========================================
      // CREATE DATA
      // ========================================

      const data = {
        pickupLocation: {
          address: pickupAddress.trim(),
          latitude: pickupLatitude,
          longitude: pickupLongitude,
        },

        deliveryLocation: {
          address: deliveryAddress.trim(),
          latitude,
          longitude,
        },

        packageDescription:
          packageDescription.trim(),

        packageWeight: weight,

        notes: notes.trim(),
      };

      // ========================================
      // SEND TO BACKEND
      // ========================================

      const delivery =
        await dispatch(
          createCustomerDeliveryThunk({
            data,
            token,
          })
        ).unwrap();

      Alert.alert(
        "Delivery Created",
        "Your delivery has been created successfully.",
        [
          {
            text: "View Delivery",
            onPress: () =>
              router.push(`/(customer)/create/${delivery._id}`),
          },
        ]
      );

    } catch (error: any) {
      console.error(
        "CREATE DELIVERY ERROR:",
        error
      );

      Alert.alert(
        "Error",
        error?.message ||
          String(error) ||
          "Failed to create delivery."
      );
    }
  };

  // ============================================
  // SCREEN
  // ============================================

  return (
    <View className="flex-1 bg-slate-100">

      {/* HEADER */}

      <View className="bg-blue-700 px-5 pb-6 pt-14">

        <Pressable
          onPress={() => router.back()}
        >
          <Text className="text-base font-semibold text-white">
            ← Back
          </Text>
        </Pressable>

        <Text className="mt-4 text-2xl font-bold text-white">
          Create Delivery
        </Text>

        <Text className="mt-1 text-blue-100">
          Enter your delivery details
        </Text>

      </View>

      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        enableOnAndroid={true}
        extraScrollHeight={20}
        contentContainerStyle={{
          padding: 20,
          paddingBottom: 150,
        }}
      >
          {/* PICKUP */}

        <Text className="text-sm font-semibold text-slate-700">
          Pickup Location
        </Text>

        <TextInput
          value={pickupAddress}
          onChangeText={setPickupAddress}
          placeholder="Enter pickup address"
          placeholderTextColor="#94a3b8"
          className="mt-2 rounded-xl bg-white px-4 py-4 text-slate-900"
        />

        <Text className="mt-2 text-xs text-slate-400">
          Your current GPS location will be used as the pickup coordinates.
        </Text>

        {/* DESTINATION */}

        <Text className="mt-5 text-sm font-semibold text-slate-700">
          Delivery Location
        </Text>

        <TextInput
          value={deliveryAddress}
          onChangeText={setDeliveryAddress}
          placeholder="Enter delivery address"
          placeholderTextColor="#94a3b8"
          className="mt-2 rounded-xl bg-white px-4 py-4 text-slate-900"
        />

        {/* DESTINATION LATITUDE */}

        <Text className="mt-4 text-sm font-semibold text-slate-700">
          Destination Latitude
        </Text>

        <TextInput
          value={deliveryLatitude}
          onChangeText={setDeliveryLatitude}
          placeholder="e.g. 10.3158"
          placeholderTextColor="#94a3b8"
          keyboardType="decimal-pad"
          className="mt-2 rounded-xl bg-white px-4 py-4 text-slate-900"
        />

        {/* DESTINATION LONGITUDE */}

        <Text className="mt-4 text-sm font-semibold text-slate-700">
          Destination Longitude
        </Text>

        <TextInput
          value={deliveryLongitude}
          onChangeText={setDeliveryLongitude}
          placeholder="e.g. 9.8442"
          placeholderTextColor="#94a3b8"
          keyboardType="decimal-pad"
          className="mt-2 rounded-xl bg-white px-4 py-4 text-slate-900"
        />

        {/* PACKAGE DESCRIPTION */}

        <Text className="mt-5 text-sm font-semibold text-slate-700">
          Package Description
        </Text>

        <TextInput
          value={packageDescription}
          onChangeText={setPackageDescription}
          placeholder="e.g. Clothes, documents, food"
          placeholderTextColor="#94a3b8"
          className="mt-2 rounded-xl bg-white px-4 py-4 text-slate-900"
        />

        {/* PACKAGE WEIGHT */}

        <Text className="mt-5 text-sm font-semibold text-slate-700">
          Package Weight (kg)
        </Text>

        <TextInput
          value={packageWeight}
          onChangeText={setPackageWeight}
          placeholder="e.g. 2.5"
          placeholderTextColor="#94a3b8"
          keyboardType="decimal-pad"
          className="mt-2 rounded-xl bg-white px-4 py-4 text-slate-900"
        />

        {/* NOTES */}

        <Text className="mt-5 text-sm font-semibold text-slate-700">
          Notes
        </Text>

        <TextInput
          value={notes}
          onChangeText={setNotes}
          placeholder="Additional instructions (optional)"
          placeholderTextColor="#94a3b8"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          className="mt-2 min-h-[110px] rounded-xl bg-white px-4 py-4 text-slate-900"
        />

        {/* CREATE */}

      
<Pressable
  disabled={creating}
  onPress={handleCreateDelivery}
  className={`mt-7 rounded-xl py-4 ${
    creating
      ? "bg-blue-400"
      : "bg-blue-700"
  }`}
>
  {creating ? (
    <View className="flex-row items-center justify-center">
      <ActivityIndicator
        size="small"
        color="#ffffff"
      />

      <Text className="ml-2 text-base font-bold text-white">
        Creating Delivery...
      </Text>
    </View>
  ) : (
    <Text className="text-center text-base font-bold text-white">
      CREATE DELIVERY
    </Text>
  )}
</Pressable>


      </KeyboardAwareScrollView>

    </View>
  );
};

export default CreateDelivery;

