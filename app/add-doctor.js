import React, { useState } from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  TouchableOpacity,
  Text as RNText,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TextInput, Button, Text, Card, IconButton, useTheme, Snackbar } from "react-native-paper";
import { useRouter } from "expo-router";
import { databases, ID as dbID } from "../lib/appwrite";

const specializations = [
  { name: "Cardiologist", icon: "heart", id: "6931563e00352cb0363a" },
  { name: "Dentist", icon: "tooth", id: "6932a38d0023ca5f8e5f" },
  { name: "Neurologist", icon: "brain", id: "6932a418002b9b0b92bb" },
  { name: "General", icon: "user-md", id: "693157aa001878172af0" },
  { name: "Pediatrician", icon: "baby", id: "6932a4a3002963dd6705" },
];

export default function AddDoctor() {
  const router = useRouter();
  const theme = useTheme();

  const [doctor, setDoctor] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    yearsOfExperience: "",
    fees: "",
    specialization: "",
    specializationId: "",
    imageUrl: "",
  });

  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ visible: false, message: "" });

  const filteredSpecializations = specializations.filter((spec) =>
    spec.name.toLowerCase().includes(doctor.specialization.toLowerCase())
  );

  const handleSubmit = async () => {
    if (
      !doctor.firstName ||
      !doctor.lastName ||
      !doctor.email ||
      !doctor.phoneNumber ||
      !doctor.yearsOfExperience ||
      !doctor.fees ||
      !doctor.specializationId
    ) {
      setSnackbar({ visible: true, message: "Please fill all required fields!" });
      return;
    }

    try {
      setLoading(true);
      await databases.createDocument(
        "692923c0000e958a6532",
        "doctors",
        dbID.unique(),
        {
          firstName: doctor.firstName,
          lastName: doctor.lastName,
          email: doctor.email,
          phoneNumber: Number(doctor.phoneNumber),
          yearsOfExperience: Number(doctor.yearsOfExperience),
          fees: Number(doctor.fees),
          specializationId: doctor.specializationId,
          ImageUrl: doctor.imageUrl || null,
        }
      );

      // Show success snackbar
      setSnackbar({ visible: true, message: "Doctor added successfully!" });
      alert("Doctor added successfully ")
      // Wait a short while before navigating back
      setTimeout(() => {
        router.back();
      }, 1500); // 1.5s
    } catch (err) {
      console.log(err);
      setSnackbar({ visible: true, message: "Error adding doctor!" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          {/* Top-right close button */}
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.closeIcon}
          >
            <IconButton icon="close" size={28} />
          </TouchableOpacity>

          <Text variant="headlineMedium" style={styles.headerText}>
            Add Doctor
          </Text>

          <Card style={styles.formCard}>
            <Card.Content>
              {/* Text Inputs */}
              {[
                { label: "First Name", value: doctor.firstName, key: "firstName", keyboard: "default", autoCapitalize: "words" },
                { label: "Last Name", value: doctor.lastName, key: "lastName", keyboard: "default", autoCapitalize: "words" },
                { label: "Email", value: doctor.email, key: "email", keyboard: "email-address", autoCapitalize: "none" },
                { label: "Phone Number", value: doctor.phoneNumber, key: "phoneNumber", keyboard: "numeric", autoCapitalize: "none" },
                { label: "Years of Experience", value: doctor.yearsOfExperience, key: "yearsOfExperience", keyboard: "numeric", autoCapitalize: "none" },
                { label: "Fees", value: doctor.fees, key: "fees", keyboard: "numeric", autoCapitalize: "none" },
              ].map((item) => (
                <TextInput
                  key={item.key}
                  label={item.label}
                  mode="outlined"
                  keyboardType={item.keyboard}
                  autoCapitalize={item.autoCapitalize}
                  value={item.value}
                  onChangeText={(text) => setDoctor({ ...doctor, [item.key]: text })}
                  style={styles.input}
                  outlineColor="#ccc"
                  // activeOutlineColor="#3867d6"
                />
              ))}

              {/* Specialization input with autocomplete */}
              <TextInput
                label="Specialization"
                mode="outlined"
                value={doctor.specialization}
                onChangeText={(text) => setDoctor({ ...doctor, specialization: text, specializationId: "" })}
                style={styles.input}
                outlineColor="#ccc"
                // activeOutlineColor="#3867d6"
              />

              {/* Autocomplete hints */}
              {doctor.specialization.length > 0 && filteredSpecializations.length > 0 && (
                <View style={styles.hintContainer}>
                  {filteredSpecializations.map((spec) => (
                    <TouchableOpacity
                      key={spec.id}
                      onPress={() =>
                        setDoctor({
                          ...doctor,
                          specialization: spec.name,
                          specializationId: spec.id,
                        })
                      }
                      style={styles.hintItem}
                    >
                      <RNText style={{ color: "#3867d6" }}>• {spec.name}</RNText>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {/* Image URL */}
              <TextInput
                label="Image URL (Optional)"
                mode="outlined"
                value={doctor.imageUrl}
                onChangeText={(text) => setDoctor({ ...doctor, imageUrl: text })}
                style={styles.input}
                outlineColor="#ccc"
                // activeOutlineColor="#3867d6"
              />

              {/* Submit button */}
              <Button
                mode="contained"
                loading={loading}
                disabled={loading}
                onPress={handleSubmit}
                style={styles.submitButton}
              >
                {loading ? "Adding..." : "Add Doctor"}
              </Button>
            </Card.Content>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Snackbar */}
      <Snackbar
        visible={snackbar.visible}
        onDismiss={() => setSnackbar({ ...snackbar, visible: false })}
        duration={2000}
      >
        {snackbar.message}
      </Snackbar>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
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
