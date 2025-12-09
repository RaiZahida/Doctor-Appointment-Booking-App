import { Stack, useRouter } from "expo-router";
import { View, Image, StyleSheet } from "react-native";
import { Button, Text } from "react-native-paper";
import { useAuth } from "../auth-context";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

export default function Index() {
  const { user } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets(); // 👉 prevents collision with system icons

  const handleGetStarted = () => {
    if (user) {
      router.replace("/(tabs)/home");
    } else {
      router.replace("/auth");
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
          presentation: "modal",
          animation: "slide_from_bottom",
        }}
      />

      <View style={styles.container}>
        {/* Full background image */}
        <Image
          source={require("@/assets/images/image.png")}
          style={styles.image}
          resizeMode="cover"
        />

        {/* Bottom sheet */}
        <SafeAreaView
          style={[
            styles.sheet,
            { paddingBottom: insets.bottom + 20 }, // ❤️ adds safe-area space
          ]}
        >
          <Text variant="headlineSmall" style={styles.title}>
            Welcome to the App
          </Text>

          <Text variant="bodyMedium" style={styles.subtitle}>
            Your journey starts right here.
          </Text>

          <Button mode="contained" onPress={handleGetStarted}>
            Get Started
          </Button>
        </SafeAreaView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
  image: {
    position: "absolute",
    width: "100%",
    height: "70%",
  },
  sheet: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "white",
    paddingTop: 24,
    paddingHorizontal: 24,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    elevation: 10,
  },
  title: { textAlign: "center", marginBottom: 8 },
  subtitle: {
    textAlign: "center",
    marginBottom: 20,
    opacity: 0.8,
  },
});
