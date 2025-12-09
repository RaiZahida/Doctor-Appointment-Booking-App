import React, { useEffect, useState } from "react";
import { useFocusEffect } from "expo-router";
// import React from "react";
import {
  View,
  FlatList,
  Image,
  Pressable,
  Modal,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import {
  Card,
  Text,
  ActivityIndicator,
  IconButton,
  Button,
  TextInput,
  Snackbar,
  useTheme,
} from "react-native-paper";
import { databases } from "../lib/appwrite";
import { useAuth } from "../auth-context";

export default function Doctors() {
  const router = useRouter();
  const { specializationId } = useLocalSearchParams();
  const { user, loading: authLoading } = useAuth();
  const theme = useTheme();

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ visible: false, message: "" });
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const placeholderImage = require("@/assets/images/placeholder.png");
  useFocusEffect(
    React.useCallback(() => {
      getDoctors();     // ⬅️ this will refresh every time you come back
    }, [])
  );
  const getDoctors = async () => {
    try {
      const res = await databases.listDocuments(
        "692923c0000e958a6532",
        "doctors"
      );

      let allDoctors = res.documents;

      if (specializationId) {
        allDoctors = allDoctors.filter(
          (doc) => doc.specializationId === specializationId
        );
      }

      setDoctors(allDoctors);
    } catch (error) {
      console.log("Error loading doctors:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDoctors();
  }, [specializationId]);

  const handleEditClick = (doctor) => {
    setSelectedDoctor({ ...doctor });
    setModalVisible(true);
  };

  const handleUpdateDoctor = async () => {
    if (
      !selectedDoctor.firstName ||
      !selectedDoctor.lastName ||
      !selectedDoctor.email ||
      !selectedDoctor.phoneNumber ||
      !selectedDoctor.yearsOfExperience ||
      !selectedDoctor.fees
    ) {
      setSnackbar({ visible: true, message: "Please fill all required fields!" });
      return;
    }

    try {
      setUpdateLoading(true);
      await databases.updateDocument(
        "692923c0000e958a6532",
        "doctors",
        selectedDoctor.$id,
        {
          firstName: selectedDoctor.firstName,
          lastName: selectedDoctor.lastName,
          email: selectedDoctor.email,
          phoneNumber: Number(selectedDoctor.phoneNumber),
          yearsOfExperience: Number(selectedDoctor.yearsOfExperience),
          fees: Number(selectedDoctor.fees),
          specializationId: selectedDoctor.specializationId,
          ImageUrl: selectedDoctor.ImageUrl || null,
        }
      );

      setDoctors((prev) =>
        prev.map((d) => (d.$id === selectedDoctor.$id ? selectedDoctor : d))
      );

      setSnackbar({ visible: true, message: "Doctor updated successfully!" });
      setModalVisible(false);
    } catch (err) {
      console.log(err);
      setSnackbar({ visible: true, message: "Error updating doctor!" });
    } finally {
      setUpdateLoading(false);
    }
  };

  const renderDoctor = ({ item }) => (
    <Card mode="elevated" style={styles.doctorCard}>
      <Pressable style={{ flexDirection: "row", gap: 12 }}>
        <Image
          source={placeholderImage}
          style={styles.doctorImage}
        />

        <View style={{ flex: 1 }}>
          <Text variant="titleMedium">
            Dr. {item.firstName} {item.lastName}
          </Text>
          <Text variant="bodySmall">Specialization ID: {item.specializationId}</Text>
          <Text variant="bodySmall">Experience: {item.yearsOfExperience} yrs</Text>
          <Text variant="bodySmall">Fees: ${item.fees}</Text>
        </View>
      </Pressable>

      {user?.role === "admin" && (
        <IconButton
          icon="pencil"
          iconColor="green"
          size={22}
          style={{ position: "absolute", right: 5, top: 5 }}
          onPress={() => handleEditClick(item)}
          disabled={updateLoading}
        />
      )}
    </Card>
  );

  if (loading || authLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      {/* Header with title and close button */}
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.headerTitle}>
          All Doctors
        </Text>
        <IconButton
          icon="close"
          size={28}
          onPress={() => router.back()}
        />
      </View>

      <FlatList
        contentContainerStyle={{ paddingBottom: 20 }}
        data={doctors}
        keyExtractor={(item) => item.$id}
        renderItem={renderDoctor}
      />

      {/* Edit Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text variant="headlineSmall">Edit Doctor</Text>
              <IconButton
                icon="close"
                size={28}
                onPress={() => setModalVisible(false)}
              />
            </View>

            <ScrollView contentContainerStyle={styles.modalContent}>
              {selectedDoctor &&
                [
                  { label: "First Name", key: "firstName", keyboard: "default" },
                  { label: "Last Name", key: "lastName", keyboard: "default" },
                  { label: "Email", key: "email", keyboard: "email-address" },
                  { label: "Phone Number", key: "phoneNumber", keyboard: "numeric" },
                  { label: "Years of Experience", key: "yearsOfExperience", keyboard: "numeric" },
                  { label: "Fees", key: "fees", keyboard: "numeric" },
                ].map((field) => (
                  <TextInput
                    key={field.key}
                    label={field.label}
                    mode="outlined"
                    value={selectedDoctor[field.key]?.toString()}
                    keyboardType={field.keyboard}
                    onChangeText={(text) =>
                      setSelectedDoctor({ ...selectedDoctor, [field.key]: text })
                    }
                    style={{ marginBottom: 10 }}
                  />
                ))}

              <Button
                mode="contained"
                loading={updateLoading}
                onPress={handleUpdateDoctor}
                style={{ marginTop: 10 }}
              >
                {updateLoading ? "Updating..." : "Update Doctor"}
              </Button>
            </ScrollView>
          </View>
        </View>
      </Modal>

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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    backgroundColor: "#fff",
    marginTop:50
  },
  headerTitle: {
    fontWeight: "700",
  },
  doctorCard: {
    margin: 10,
    padding: 10,
    borderRadius: 12,
    elevation: 3,
    backgroundColor: "#fff",
  },
  doctorImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    backgroundColor: "#eee",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 15,
  },
  modalCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 15,
    maxHeight: "90%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  modalContent: {
    paddingBottom: 20,
  },
});
