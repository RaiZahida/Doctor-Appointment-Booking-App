import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Button, Card, Title, useTheme } from "react-native-paper";
import { useRouter } from "expo-router";
import { account } from "../../lib/appwrite";
import { FontAwesome5 } from "@expo/vector-icons";
import { useAuth } from "../../auth-context";

const specializations = [
  { name: "Cardiologist", icon: "heart", id: "6931563e00352cb0363a" },
  { name: "Dentist", icon: "tooth", id: "6932a38d0023ca5f8e5f" },
  { name: "Neurologist", icon: "brain", id: "6932a418002b9b0b92bb" },
  { name: "General", icon: "user-md", id: "693157aa001878172af0" },
  { name: "Pediatrician", icon: "baby", id: "6932a4a3002963dd6705" },
];

export default function Home() {
  const router = useRouter();
  const theme = useTheme();
  const { user, loading } = useAuth(); // get user from context

  if (loading) {
    return <View style={{ flex: 1 }} />; // simple loader placeholder
  }

  // --- ADMIN DASHBOARD ---
  if (user?.role === "admin") {
    return (
      <View style={styles.container}>
        <Text style={{ ...styles.heading, color: theme.colors.primary }}>
          Admin Dashboard
        </Text>
        <Button
          mode="contained"
          style={{ marginVertical: 10 }}
          onPress={() => router.push("/add-doctor")}
        >
          Add Doctor
        </Button>
        <Button
          mode="contained"
          style={{ marginVertical: 10 }}
          onPress={() => router.push("/doctor")}
        >
          Delete  Doctors
        </Button>
        <Button
          mode="contained"
          style={{ marginVertical: 10 }}
          onPress={() => router.push("/edit-doctor")}
        >
        Edit  Doctors
        </Button>
        <Button
          mode="contained"
          style={{ marginVertical: 10 }}
          onPress={() => router.push("/addclinic")}
        >
          Add Clinic
        </Button>
        {/* You can add more admin actions here */}
      </View>
    );
  }

  // --- NORMAL USER HOME ---
  return (
    <View style={styles.container}>
      {/* Greeting */}
      <Text style={{ ...styles.heading, color: theme.colors.primary }}>
    Salam,   
            {user?.name || "User"}
      </Text>
      <Text style={styles.sub}>Book your next appointment easily</Text>

      {/* Specializations */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.specialScroll}
      >
        {specializations.map((spec, index) => (
          <Card
            key={index}
            style={styles.specCard}
            onPress={() =>
              router.push(`/doctor?specializationId=${spec.id}`)
            }
          >
            <Card.Content style={styles.cardContent}>
              <FontAwesome5
                name={spec.icon}
                size={28}
                color={"#ffffff"}
              />
              <Title style={styles.specText}
               >{spec.name}</Title>
            </Card.Content>
          </Card>
        ))}
      </ScrollView>

      {/* Action Buttons */}
      <Button
        mode="contained"
        icon="stethoscope"
        style={styles.btn}
        onPress={() => router.push("/doctor")}
      >
        Find Doctors
      </Button>

      <Button
        mode="contained"
        icon="calendar-check"
        style={styles.btn}
        onPress={() => router.push("/appointment")}
      >
        Your Appointments
      </Button>

      <Button
        mode="contained"
        icon="account"
        style={styles.btn}
        onPress={() => router.push("/profile")}
      >
        Profile
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    backgroundColor: "#f5f6fa",
  },
  heading: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 5,
  },
  sub: {
    fontSize: 16,
    // color: "#ffffff",
    marginBottom: 25,
  },
  specialScroll: {
    marginBottom: 30,
  },
  specCard: {
    width: 200,
    marginRight: 15,
    borderRadius: 15,
    borderColor: '#ffffff',
    backgroundColor: "#3c6e71",
    borderWidth: 2,
    elevation: 3,
    justifyContent: "center",
    alignItems: "center",
    
  },
  cardContent: {
    alignItems: "center",
    justifyContent: "center",
  },
  specText: {
    marginTop: 10,
    fontSize: 16,
    textAlign: "center",
  color: "#ffffff",
  },
  btn: {
    marginBottom: 15,
    borderRadius: 10,
    paddingVertical: 6,
  },
});
