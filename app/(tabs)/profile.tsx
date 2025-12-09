import React, { useState } from "react";
import { View, Text, Alert, Image } from "react-native";
import { Button, TextInput, Card } from "react-native-paper";
import { useAuth } from "../../auth-context";
import { useRouter } from "expo-router";
export default function ProfileScreen() {
  const { user, logout, updateName } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [loading, setLoading] = useState(false);
const router = useRouter();
  const confirmLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to log out?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            setLoading(true);
            await logout();
router.push("/auth")
            setLoading(false);
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleNameUpdate = async () => {
    if (!name.trim()) {
      Alert.alert("Error", "Name cannot be empty.");
      return;
    }

    try {
      setLoading(true);
      await updateName(name.trim());
      Alert.alert("Success", "Your name has been updated!");
    } catch (err) {
      Alert.alert("Error", "Failed to update name.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: "#f2f4f7" }}>
      {/* Header */}
      <Text
        style={{
          fontSize: 28,
          fontWeight: "800",
          textAlign: "center",
          marginBottom: 20,
        }}
      >
        My Profile
      </Text>

      {/* Profile Card */}
      <Card style={{ padding: 20, borderRadius: 16, elevation: 4 }}>
        <View
          style={{
            alignItems: "center",
            marginBottom: 25,
            gap: 10,
          }}
        >
          {/* Avatar */}
          <Image
            source={{
              uri:
                "https://cdn-icons-png.flaticon.com/512/149/149071.png",
            }}
            style={{
              width: 90,
              height: 90,
              borderRadius: 50,
              marginBottom: 8,
            }}
          />
          <Text style={{ fontSize: 20, fontWeight: "700" }}>
            {user?.name || "User"}
          </Text>
          <Text style={{ color: "gray" }}>{user?.email}</Text>
        </View>

        {/* Input */}
        <TextInput
          label="Update Name"
          mode="outlined"
          value={name}
          onChangeText={setName}
          style={{ marginBottom: 15 }}
        />

        {/* Update Button */}
        <Button
          mode="contained"
          onPress={handleNameUpdate}
          loading={loading}
          style={{ marginBottom: 15, padding: 5, borderRadius: 10 }}
        >
          Save Changes
        </Button>

        {/* Logout Button */}
        <Button
          mode="outlined"
          onPress={confirmLogout}
          loading={loading}
          textColor="red"
          style={{
            borderColor: "red",
            padding: 5,
            borderRadius: 10,
          }}
        >
          Logout
        </Button>
      </Card>
    </View>
  );
}
