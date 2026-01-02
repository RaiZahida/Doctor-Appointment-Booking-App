import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { TextInput, Button, IconButton } from "react-native-paper";
import { useState } from "react";
import { router } from "expo-router";
import { databases, ID } from "../lib/appwrite"; // adjust path if needed

const DATABASE_ID = "692923c0000e958a6532";
const CLINICS_COLLECTION_ID = "clinics";

export default function AddClinic() {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name || !address) {
      Alert.alert("Error", "Clinic name and address are required");
      return;
    }

    try {
      setLoading(true);

      await databases.createDocument(
        DATABASE_ID,
        CLINICS_COLLECTION_ID,
        ID.unique(),
        {
          name,
          address,
          phone,
          isActive: true,
        }
      );

      Alert.alert("Success", "Clinic added successfully");
      router.back();
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* ❌ Cross Button */}
      <IconButton
        icon="close"
        size={22}
        onPress={() => router.back()}
        style={styles.closeIcon}
      />

      <Text style={styles.headerText}>Add Clinic</Text>

      <View style={styles.formCard}>
        <TextInput
          label="Clinic Name"
          mode="outlined"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />

        <TextInput
          label="Clinic Address"
          mode="outlined"
          value={address}
          onChangeText={setAddress}
          multiline
          numberOfLines={3}
          style={styles.input}
        />

        <TextInput
          label="Phone (optional)"
          mode="outlined"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          style={styles.input}
        />

        <Button
          mode="contained"
          onPress={handleSubmit}
          loading={loading}
          disabled={loading}
          style={styles.submitButton}
        >
          Add Clinic
        </Button>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
    container: {
        marginTop:120,
      padding: 20,
      flexGrow: 1,
      justifyContent: "flex-start",
      paddingBottom: 40,
    },
    closeIcon: {
      position: "absolute",
      right: 10,
      top: 10,
      zIndex: 10,
    },
    headerText: {
      fontWeight: "700",
      textAlign: "center",
      marginBottom: 25,
      marginTop: 10,
      fontSize: 18,
    },
    formCard: {
      padding: 15,
      borderRadius: 16,
      elevation: 5,
      backgroundColor: "#fff",
    },
    input: {
      marginBottom: 15,
      backgroundColor: "#fff",
    },
    hintContainer: {
      marginBottom: 12,
      flexDirection: "row",
      flexWrap: "wrap",
    },
    hintItem: {
      marginRight: 8,
      marginBottom: 6,
      paddingHorizontal: 8,
      paddingVertical: 4,
      backgroundColor: "#e6f0ff",
      borderRadius: 8,
    },
    submitButton: {
      marginTop: 10,
      paddingVertical: 6,
      borderRadius: 8,
    },
  });
  