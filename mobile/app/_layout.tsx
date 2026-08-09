import { Stack } from "expo-router";
import "../global.css";

import ReduxProvider from "../components/ReduxProvider";

export default function RootLayout() {
  return (
    <ReduxProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </ReduxProvider>
  );
}