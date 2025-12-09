import React, { useEffect, useState } from "react";
import { View, FlatList, Image, Pressable, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Card, Text, ActivityIndicator, Button, IconButton, Snackbar } from "react-native-paper";
import { databases } from "../../lib/appwrite";
import { useAuth } from "../../auth-context";

// Define specializations locally
const specializations = [
  { name: "Cardiologist", icon: "heart", id: "6931563e00352cb0363a" },
  { name: "Dentist", icon: "tooth", id: "6932a38d0023ca5f8e5f" },
  { name: "Neurologist", icon: "brain", id: "6932a418002b9b0b92bb" },
  { name: "General", icon: "user-md", id: "693157aa001878172af0" },
  { name: "Pediatrician", icon: "baby", id: "6932a4a3002963dd6705" },
];

export default function Doctors() {
  const router = useRouter();
  const { specializationId } = useLocalSearchParams();
  const { user, loading: authLoading } = useAuth();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [snackbar, setSnackbar] = useState({ visible: false, message: "" });

  const placeholderImage = require("@/assets/images/placeholder.png");

  const getDoctors = async () => {
    try {
      setLoading(true);
      const res = await databases.listDocuments("692923c0000e958a6532", "doctors");
      let allDoctors = res.documents;

      // Filter by specializationId if provided
      if (specializationId) {
        allDoctors = allDoctors.filter(doc => doc.specializationId === specializationId);
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

  const deleteDoctor = (id, name) => {
    Alert.alert(
      "Delete Doctor",
      `Are you sure you want to delete Dr. ${name}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              setDeletingId(id);
              await databases.deleteDocument("692923c0000e958a6532", "doctors", id);
              setDoctors(prev => prev.filter(doc => doc.$id !== id));
              setSnackbar({ visible: true, message: `Dr. ${name} deleted successfully!` });
            } catch (err) {
              console.log("Delete error:", err);
              setSnackbar({ visible: true, message: `Failed to delete Dr. ${name}.` });
            } finally {
              setDeletingId(null);
            }
          },
        },
      ]
    );
  };

  const renderDoctor = ({ item }) => {
    // Map specializationId to its name
    const specialization = specializations.find(spec => spec.id === item.specializationId)?.name || "N/A";

    return (
      <Card
        mode="elevated"
        style={{ margin: 10, padding: 10, borderRadius: 12, position: "relative" }}
      >
        <Pressable
          onPress={() => router.push(`/doctor-detail?id=${item.$id}`)}
          style={{ flexDirection: "row", gap: 12 }}
        >
          <Image
            source={placeholderImage}
            style={{ width: 80, height: 80, borderRadius: 10, backgroundColor: "#eee" }}
          />

          <View style={{ flex: 1 }}>
            <Text variant="titleMedium">
              Dr. {item.firstName} {item.lastName}
            </Text>
            <Text variant="bodySmall">Specialization: {specialization}</Text>
            <Text variant="bodySmall">Experience: {item.yearsOfExperience} yrs</Text>
            <Text variant="bodySmall">Fees: ${item.fees}</Text>
          </View>
        </Pressable>

        {user?.role === "admin" && (
          deletingId === item.$id ? (
            <ActivityIndicator
              size="small"
              style={{ position: "absolute", right: 15, top: 15 }}
            />
          ) : (
            <IconButton
              icon="delete"
              iconColor="red"
              size={22}
              style={{ position: "absolute", right: 5, top: 5 }}
              onPress={() => deleteDoctor(item.$id, item.firstName + " " + item.lastName)}
            />
          )
        )}
      </Card>
    );
  };

  if (loading || authLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={doctors}
        keyExtractor={(item) => item.$id}
        renderItem={renderDoctor}
      />

      {specializationId && (
        <Button
          mode="contained"
          style={{ margin: 15, paddingVertical: 8, borderRadius: 10 }}
          onPress={() => router.push("/doctor")}
        >
          View All Doctors
        </Button>
      )}

      <Snackbar
        visible={snackbar.visible}
        onDismiss={() => setSnackbar({ ...snackbar, visible: false })}
        duration={2000}
      >
        {snackbar.message}
      </Snackbar>
    </View>
  );
}
;