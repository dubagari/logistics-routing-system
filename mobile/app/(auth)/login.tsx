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
import { loginUser } from "../../services/authService";
import { useAppDispatch } from "../../hooks/redux";
import { loginSuccess } from "../../store/slices/authSlice";
import { useRouter } from "expo-router";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert(
        "Validation",
        "Email and password are required"
      );
      return;
    }

    try {
      setLoading(true);

      const response = await loginUser({
        email: email.trim(),
        password,
      });

      dispatch(
        loginSuccess({
          user: response.user,
          token: response.token,
        })
      );

      if (response.user.role === "driver") {
        router.replace("/(driver)");
      } else if (response.user.role === "customer") {
        router.replace("/(customer)");
      } else if (response.user.role === "admin") {
        router.replace("/(admin)");
      }
    } catch (error: any) {
      Alert.alert(
        "Login Failed",
        error.message || "Unable to login"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-slate-100"
      behavior={
        Platform.OS === "ios"
          ? "padding"
          : undefined
      }
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
              Welcome Back
            </Text>

            <Text className="mt-2 text-base text-slate-500">
              Login to your delivery account
            </Text>
          </View>

          {/* Email */}
          <Text className="mb-2 font-semibold text-slate-700">
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

          {/* Password */}
          <Text className="mt-5 mb-2 font-semibold text-slate-700">
            Password
          </Text>

          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
            placeholderTextColor="#94a3b8"
            secureTextEntry
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 text-slate-900"
          />

          {/* Login */}
          <Pressable
            onPress={handleLogin}
            disabled={loading}
            className="mt-7 rounded-xl bg-blue-700 py-4 active:opacity-80"
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text className="text-center font-bold text-white">
                LOGIN
              </Text>
            )}
          </Pressable>

          {/* Register */}
          <Pressable
            onPress={() => router.push("/register")}
            className="mt-6"
          >
            <Text className="text-center text-slate-500">
              Don't have an account?{" "}
              <Text className="font-bold text-blue-700">
                Register
              </Text>
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}