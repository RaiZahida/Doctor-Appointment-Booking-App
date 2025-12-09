import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function Call() {
  const router = useRouter();
  const [micOn, setMicOn] = useState(true);

  const callerName = "John Doe"; // You can replace with dynamic name later

  return (
    <ImageBackground
      source={require("@/assets/images/image.png")}
      style={styles.background}
      blurRadius={12}
    >
      {/* Top overlay: caller info */}
      <View style={styles.topContainer}>
        <Text style={styles.callerName}>{callerName}</Text>
        <Text style={styles.statusText}>
          {micOn ? "Microphone is ON 🎤" : "Microphone is OFF ❌"}
        </Text>
      </View>

      {/* Bottom buttons */}
      <View style={styles.bottomContainer}>
        {/* Mic toggle */}
        <TouchableOpacity
          style={[styles.buttonCircle, { backgroundColor: micOn ? "#3867d6" : "#555" }]}
          onPress={() => setMicOn(!micOn)}
        >
          <FontAwesome name={micOn ? "microphone" : "microphone-slash"} size={28} color="white" />
        </TouchableOpacity>

        {/* End call */}
        <TouchableOpacity
          style={[styles.buttonCircle, { backgroundColor: "red", marginTop: 30 }]}
          onPress={() => router.back()}
        >
          <FontAwesome name="phone" size={36} color="white" />
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 80,
  },
  topContainer: {
    alignItems: "center",
  },
  callerName: {
    fontSize: 32,
    fontWeight: "700",
    color: "white",
    marginBottom: 10,
  },
  statusText: {
    fontSize: 18,
    color: "white",
    fontWeight: "500",
  },
  bottomContainer: {
    alignItems: "center",
  },
  buttonCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
});
