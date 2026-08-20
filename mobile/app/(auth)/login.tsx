import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  ActivityIndicator,
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

    console.log("LOGIN RESPONSE:", response);

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
    console.log("AUTH USER:", response.user);
    console.log("AUTH TOKEN:", response.token);  

    // Alert.alert(
    //   "Success",
    //   `Welcome ${response.user.name}`
    // );

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
    <View className="flex-1 bg-slate-100 justify-center px-6">
      <View className="rounded-3xl bg-white p-6">
        <Text className="text-3xl font-bold text-slate-900">
          Welcome Back
        </Text>

        <Text className="mt-2 text-slate-500">
          Login to your delivery account
        </Text>

        <Text className="mt-8 mb-2 font-semibold text-slate-700">
          Email
        </Text>

        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
          keyboardType="email-address"
          autoCapitalize="none"
          className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-4"
        />

        <Text className="mt-5 mb-2 font-semibold text-slate-700">
          Password
        </Text>

        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Enter your password"
          secureTextEntry
          className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-4"
        />

        <Pressable
          onPress={handleLogin}
          disabled={loading}
          className="mt-7 rounded-xl bg-blue-700 py-4"
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text className="text-center font-bold text-white">
              LOGIN
            </Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}