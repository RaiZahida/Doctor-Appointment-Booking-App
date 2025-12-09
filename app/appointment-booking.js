import React, { useState } from "react";
import { View, ScrollView, Text, KeyboardAvoidingView, Platform } from "react-native";
import { TextInput, Button, useTheme, HelperText, IconButton } from "react-native-paper";
import { useLocalSearchParams, useRouter } from "expo-router";
import { databases } from "../lib/appwrite"; // your Appwrite config
import { useAuth } from "../auth-context";    // to get current logged-in user
import DateTimePicker from "@react-native-community/datetimepicker";

export default function BookAppointment() {
  const router = useRouter();
  const { id: doctorId } = useLocalSearchParams();
  const theme = useTheme();
  const { user } = useAuth();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = "Name is required";
    if (!phone.trim()) newErrors.phone = "Phone number is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      await databases.createDocument(
        "692923c0000e958a6532",
        "appointment",
        "unique()",  // Note: This should be ID.unique() – "unique()" is a string, not a function call
        {
          doctorId: doctorId,
          userId: user.$id,
          name: name.trim(),
          phone: Number(phone),
          date: date.toISOString().split("T")[0], // YYYY-MM-DD
          time: time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          notes: notes.trim(),
          status: "scheduled"
        },
        [
          "read(\"users\")",    // Any authenticated user can read
          "write(\"users\")",   // Any authenticated user can write
          "update(\"users\")",  // Any authenticated user can update
          "delete(\"users\")"   // Any authenticated user can delete
        ]
      );

      alert("Booking confirmed!");
      router.push("/home");
    } catch (err) {
      console.log("Error saving booking:", err);
      alert("Something went wrong. Please try again.");
    }
  };
  

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          padding: 20,
          backgroundColor: theme.colors.background,
          marginTop: 100
        }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <Text style={{ fontSize: 22, fontWeight: "bold", color: theme.colors.primary }}>
            Book Appointment
          </Text>
          <IconButton icon="close" size={28} onPress={() => router.back()} />
        </View>

        <Text style={{ marginBottom: 10, fontWeight: "600" }}>
          Booking for doctor ID: {doctorId}
        </Text>

        <TextInput
          label="Your Name"
          value={name}
          onChangeText={setName}
          mode="outlined"
          style={{ marginBottom: 5 }}
          error={!!errors.name}
        />
        {errors.name && <HelperText type="error">{errors.name}</HelperText>}

        <TextInput
          label="Phone Number"
          value={phone}
          onChangeText={setPhone}
          mode="outlined"
          keyboardType="phone-pad"
          style={{ marginBottom: 5 }}
          error={!!errors.phone}
        />
        {errors.phone && <HelperText type="error">{errors.phone}</HelperText>}

        {/* Date Picker */}
        <TextInput
          label="Select Date"
          value={date.toLocaleDateString()}
          onFocus={() => setShowDatePicker(true)}
          mode="outlined"
          style={{ marginBottom: 5 }}
          showSoftInputOnFocus={false}
          right={<TextInput.Icon icon="calendar" />}
        />
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="calendar"
            onChange={(e, selected) => {
              setShowDatePicker(Platform.OS === "ios");
              if (selected) setDate(selected);
            }}
          />
        )}

        {/* Time Picker */}
        <TextInput
          label="Select Time"
          value={time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          onFocus={() => setShowTimePicker(true)}
          mode="outlined"
          style={{ marginBottom: 5 }}
          showSoftInputOnFocus={false}
          right={<TextInput.Icon icon="clock" />}
        />
        {showTimePicker && (
          <DateTimePicker
            value={time}
            mode="time"
            is24Hour={false}
            display="spinner"
            onChange={(e, selected) => {
              setShowTimePicker(Platform.OS === "ios");
              if (selected) setTime(selected);
            }}
          />
        )}

        <TextInput
          label="Notes (optional)"
          value={notes}
          onChangeText={setNotes}
          mode="outlined"
          multiline
          numberOfLines={3}
          style={{ marginBottom: 20 }}
        />

        <Button
          mode="contained"
          onPress={handleSubmit}
          contentStyle={{ paddingVertical: 8 }}
          style={{ borderRadius: 8 }}
        >
          Confirm Booking
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
