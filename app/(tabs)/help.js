import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import { useRouter } from "expo-router";

export default function Help() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Help & Support</Text>

      <Button
        mode="contained"
        onPress={() => router.push("/call")} // we’ll make this screen next
        style={styles.button}
      >
        Start Voice Call
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 30,
  },
  button: {
    width: "80%",
    paddingVertical: 10,
  },
});
