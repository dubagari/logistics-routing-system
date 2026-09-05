import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { registerUser } from "@/services/authService";



export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
  if (
    !name.trim() ||
    !email.trim() ||
    !phone.trim() ||
    !password
  ) {
    Alert.alert(
      "Validation",
      "Please fill in all fields."
    );
    return;
  }

  if (password.length < 6) {
    Alert.alert(
      "Invalid Password",
      "Password must be at least 6 characters."
    );
    return;
  }

  try {
    setLoading(true);

    await registerUser({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      password,
    });

    Alert.alert(
      "Registration Successful",
      "Your account has been created. Please login.",
      [
        {
          text: "Login",
          onPress: () => router.replace("/login"),
        },
      ]
    );
  } catch (error) {
    Alert.alert(
      "Registration Failed",
      error instanceof Error
        ? error.message
        : "Something went wrong."
    );
  } finally {
    setLoading(false);
  }
};

  return (
   <KeyboardAvoidingView
  className="flex-1 bg-slate-100"
  behavior={Platform.OS === "ios" ? "padding" : "height"}
  keyboardVerticalOffset={Platform.OS === "ios" ? 20 : 0}
>
  <ScrollView
    contentContainerStyle={{
      flexGrow: 1,
      justifyContent: "center",
      paddingVertical: 40,
    }}
    keyboardShouldPersistTaps="handled"
    keyboardDismissMode="on-drag"
    showsVerticalScrollIndicator={false}
    className="px-6"
  >
        <View className="rounded-3xl bg-white p-7">
          {/* Header */}
          <View className="mb-8">
            <Text className="text-3xl font-bold text-slate-900">
              Create Account
            </Text>

            <Text className="mt-2 text-base text-slate-500">
              Create your customer account
            </Text>
          </View>

          {/* Name */}
          <Text className="mb-2 font-semibold text-slate-700">
            Full Name
          </Text>

          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Enter your full name"
            placeholderTextColor="#94a3b8"
            autoCapitalize="words"
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 text-slate-900"
          />

          {/* Email */}
          <Text className="mt-5 mb-2 font-semibold text-slate-700">
            Email
          </Text>

          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            placeholderTextColor="#94a3b8"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 text-slate-900"
          />

          {/* Phone */}
          <Text className="mt-5 mb-2 font-semibold text-slate-700">
            Phone
          </Text>

          <TextInput
            value={phone}
            onChangeText={setPhone}
            placeholder="Enter your phone number"
            placeholderTextColor="#94a3b8"
            keyboardType="phone-pad"
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 text-slate-900"
          />

          {/* Password */}
          <Text className="mt-5 mb-2 font-semibold text-slate-700">
            Password
          </Text>

          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Create a password"
            placeholderTextColor="#94a3b8"
            secureTextEntry
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 text-slate-900"
          />

          {/* Register */}
          <Pressable
            onPress={handleRegister}
            disabled={loading}
            className="mt-7 rounded-xl bg-blue-700 py-4 active:opacity-80"
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text className="text-center font-bold text-white">
                CREATE ACCOUNT
              </Text>
            )}
          </Pressable>

          {/* Login */}
          <Pressable
            onPress={() => router.replace("/login")}
            className="mt-6"
          >
            <Text className="text-center text-slate-500">
              Already have an account?{" "}
              <Text className="font-bold text-blue-700">
                Login
              </Text>
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}