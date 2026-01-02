import React from "react";
import { View, Text, StyleSheet, Linking, Alert } from "react-native";
import { Button } from "react-native-paper";

export default function Help() {
  const doctorNumber = "+923001234567"; // Replace with actual doctor number

  const handleCall = () => {
    // Check if device can open the dialer
    Linking.canOpenURL(`tel:${doctorNumber}`)
      .then((supported) => {
        if (!supported) {
          Alert.alert("Error", "Calling is not supported on this device");
        } else {
          return Linking.openURL(`tel:${doctorNumber}`);
        }
      })
      .catch((err) => console.error(err));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Help & Support</Text>

      <Button
        mode="contained"
        onPress={handleCall}
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
