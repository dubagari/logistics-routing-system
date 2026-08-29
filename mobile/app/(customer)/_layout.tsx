import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const CustomerLayout = () => {
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
      {/* HOME */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",

          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="home-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />

      {/* ORDERS / DELIVERIES */}
      <Tabs.Screen
        name="orders"
        options={{
          title: "Deliveries",

          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="cube-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />

      {/* TRACKING */}
      <Tabs.Screen
        name="tracking"
        options={{
          title: "Tracking",

          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="location-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />

      {/* PROFILE */}
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",

          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="person-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />

      {/* HIDDEN SCREENS */}
      <Tabs.Screen
        name="create"
        options={{
          href: null,
          tabBarStyle: { display: "none" },
        }}
      />

      <Tabs.Screen
        name="create-delivery"
        options={{
          href: null,
          tabBarStyle: { display: "none" },
        }}
      />


      <Tabs.Screen
        name="track-delivery"
        options={{
          href: null,
          tabBarStyle: { display: "none" },
        }}
      />
    </Tabs>
  );
};

export default CustomerLayout;