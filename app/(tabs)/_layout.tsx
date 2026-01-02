import { Tabs, useRouter } from "expo-router";
import { useAuth } from "../../auth-context";
import { View, Text } from "react-native";
import { useEffect } from "react";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabsLayout() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth");
    }
  }, [loading, user]);

  if (loading || !user) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#3c6e71",
        tabBarInactiveTintColor: "#777",
        tabBarStyle: {
          backgroundColor: "#fff",
          height: 70 + insets.bottom,
          paddingBottom: 10 + insets.bottom,
          paddingTop: 5,
          borderTopWidth: 0,
          elevation: 5,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "600",
        },
        headerStyle: {
          backgroundColor: "#fff",
          elevation: 2, // for Android shadow
        },
        headerTitleStyle: {
          fontSize: 20,
          fontWeight: "900",
          color: "Black",
        },
        headerTitleAlign: "center",
    
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="home" color={color} size={size || 10} />
          ),
        }}
      />
      <Tabs.Screen
        name="doctor"
        options={{
          title: "Doctors",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="local-hospital" color={color} size={size || 10} />
          ),
        }}
      />
      <Tabs.Screen
        name="appointment"
        options={{
          title: "Appointments",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="calendar-check" color={color} size={size || 10} />
          ),
        }}
      />
       <Tabs.Screen
        name="clinics"
        options={{
          title: "Clinics",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="clinic-medical" color={color} size={size || 10} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="user-circle" color={color} size={size || 10} />
          ),
        }}
      />
       <Tabs.Screen
        name="help"
        options={{
          title: "Help",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="question-circle" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
