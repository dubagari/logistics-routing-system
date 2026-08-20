import { Tabs } from "expo-router";
import { Text } from "react-native";

const DriverLayout = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#1d4ed8",
        tabBarInactiveTintColor: "#64748b",
       tabBarStyle: {
  height: 65,
  paddingBottom: 8,
  paddingTop: 8,
  position: "absolute",
  bottom: 45,
  left: 15,
  right: 15,
  borderRadius: 20,
  backgroundColor: "#ffffff",
  borderTopWidth: 0,
  elevation: 5,
  shadowColor: "#000",
  shadowOpacity: 0.1,
  shadowRadius: 10,
  shadowOffset: {
    width: 0,
    height: 4,
  },
},
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: () => <Text>🏠</Text>,
        }}
      />

      <Tabs.Screen
        name="deliveries"
        options={{
          title: "Deliveries",
          tabBarIcon: () => <Text>📦</Text>,
        }}
      />

      <Tabs.Screen
        name="route"
        options={{
          title: "Route",
          tabBarIcon: () => <Text>🗺️</Text>,
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: () => <Text>👤</Text>,
        }}
      />

      <Tabs.Screen
        name="delivery-details"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="delivery"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
};

export default DriverLayout;