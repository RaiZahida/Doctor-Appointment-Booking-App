import React, { useEffect, useState } from "react";
import { View, ScrollView, Image } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Text, ActivityIndicator, Card, Button, IconButton } from "react-native-paper";
import { databases } from "../lib/appwrite";

export default function DoctorDetail() {
  const { id } = useLocalSearchParams();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [loadingButton, setLoadingButton] = useState(false); // loader for button
  const router = useRouter();
  const placeholderImage = require("@/assets/images/placeholder.png");

  useEffect(() => {
    if (!id) {
      setError("No doctor id provided in the route.");
      setLoading(false);
      return;
    }

    const fetchDoctor = async () => {
      try {
        setLoading(true);
        const res = await databases.getDocument(
          "692923c0000e958a6532",
          "doctors",
          id
        );
        setDoctor(res);
      } catch (err) {
        console.log("Error fetching doctor:", err);
        setError("Unable to load doctor. Check console for details.");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [id]);

  const handleBookAppointment = () => {
    setLoadingButton(true); // start button loading

    setTimeout(() => {
      setLoadingButton(false); // stop button loading
      router.push(`/appointment-booking?id=${id}`); // navigate
    }, 1000); // 2 seconds fake loading
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
        <Text style={{ textAlign: "center", color: "red" }}>{error}</Text>
      </View>
    );
  }

  if (!doctor) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
        <Text>No doctor found.</Text>
      </View>
    );
  }

  const imageSource = placeholderImage;

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      {/* Cross button at top */}
      <View style={{ flexDirection: "row", justifyContent: "flex-end", marginTop: 50 }}>
        <IconButton icon="close" size={28} onPress={() => router.back()} />
      </View>

      <Card style={{ padding: 20, marginTop: 20 }}>
        <Image
          source={imageSource}
          style={{ width: 140, height: 140, alignSelf: "center", borderRadius: 12, marginBottom: 16 }}
        />

        <Text variant="titleLarge" style={{ textAlign: "center", marginBottom: 8 }}>
          Dr. {doctor.firstName} {doctor.lastName}
        </Text>

        <Text variant="bodyMedium" style={{ textAlign: "center", opacity: 0.7, marginBottom: 12 }}>
          {doctor.specialization}
        </Text>

        <Text style={{ marginBottom: 6 }}>Experience: {doctor.yearsOfExperience} yrs</Text>
        <Text style={{ marginBottom: 6 }}>Fees: ${doctor.fees}</Text>
        <Text style={{ marginBottom: 6 }}>Email: {doctor.email || "N/A"}</Text>
        <Text style={{ marginBottom: 6 }}>Phone: {doctor.phoneNumber || "N/A"}</Text>

        <Button
          mode="contained"
          onPress={handleBookAppointment}
          loading={loadingButton} // show spinner
          disabled={loadingButton} // prevent multiple clicks
          style={{ marginTop: 16 }}
        >
          {loadingButton ? "Processing..." : "Book Appointment"}
        </Button>
      </Card>
    </ScrollView>
  );
}
