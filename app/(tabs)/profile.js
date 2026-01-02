import React, { useState } from "react";
import {
  View,
  Text,
  Alert,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard
} from "react-native";
import { useAuth } from "../../auth-context";
import { useRouter } from "expo-router";
import { databases } from "../../lib/appwrite";

const DATABASE_ID = "692923c0000e958a6532";
const FEEDBACK_COLLECTION_ID = "feedback";

export default function ProfileScreen({ doctorId, doctorName, doctorSpecialization }) {
  const { user, logout } = useAuth();
  const router = useRouter();

  const [doctorNameInput, setDoctorNameInput] = useState(doctorName || "");
  const [doctorSpecializationInput, setDoctorSpecializationInput] = useState(doctorSpecialization || "");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false); // Track if feedback submitted

  // Logout handler with confirmation
  const handleLogout = () => {
    Alert.alert(
      "Confirm Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes, Logout",
          style: "destructive",
          onPress: async () => {
            try {
              await logout();
              router.push("/auth");
            } catch (err) {
              console.error(err);
              Alert.alert("Error", "Failed to logout.");
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  // Submit feedback
  const handleSubmitFeedback = async () => {
    if (!doctorNameInput.trim() || !doctorSpecializationInput.trim()) {
      Alert.alert("Error", "Please enter doctor name and specialization.");
      return;
    }

    if (!message.trim()) {
      Alert.alert(
        "No Feedback",
        "It looks like you haven't entered any feedback. Would you like to add some?",
        [
          { text: "Cancel", style: "cancel" },
          { text: "OK", onPress: () => {} },
        ]
      );
      return;
    }

    try {
      setLoading(true);
      Keyboard.dismiss(); // Hide keyboard
      await databases.createDocument(
        DATABASE_ID,
        FEEDBACK_COLLECTION_ID,
        "unique()",
        {
          // userId: user.$id,
          // doctorId: doctorId,
          doctorName: doctorNameInput.trim(),
          specialization: doctorSpecializationInput.trim(),
          message: message.trim(),
        }
      );
      Alert.alert("Success", "Feedback added successfully!");
      setSubmitted(true); // Mark feedback as submitted
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to submit feedback. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 80}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        {/* Logout Button */}
        <TouchableOpacity onPress={handleLogout} style={styles.logoutIcon}>
          <Text style={{ color: "red", fontWeight: "bold", fontSize: 16 }}>Logout</Text>
        </TouchableOpacity>

        {/* User Info */}
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user?.name}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
        </View>

        {/* Feedback Section */}
        <Text style={styles.heading}>Feedback Form</Text>

        {submitted ? (
          <View style={styles.submittedContainer}>
            <Text style={styles.submittedText}>✅ Feedback submitted successfully!</Text>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setSubmitted(false)} // Allow editing again
            >
              <Text style={styles.editButtonText}>Edit Feedback</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <Text style={styles.label}>Doctor Name</Text>
            <TextInput
              value={doctorNameInput}
              onChangeText={setDoctorNameInput}
              placeholder="Enter doctor name"
              style={styles.input}
            />

            <Text style={styles.label}>Specialization</Text>
            <TextInput
              value={doctorSpecializationInput}
              onChangeText={setDoctorSpecializationInput}
              placeholder="Enter specialization"
              style={styles.input}
            />

            <Text style={styles.label}>Message</Text>
            <TextInput
              value={message}
              onChangeText={setMessage}
              multiline
              numberOfLines={4}
              placeholder="Enter your feedback"
              style={[styles.input, { height: 120, textAlignVertical: "top" }]}
            />

            <TouchableOpacity
              style={[styles.submitButton, loading && { backgroundColor: "#888" }]}
              onPress={handleSubmitFeedback}
              disabled={loading}
            >
              <Text style={styles.submitButtonText}>
                {loading ? "Submitting..." : "Submit Feedback"}
              </Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f7f7f7",
    paddingBottom: 40,
  },
  logoutIcon: {
    position: "absolute",
    top: 20,
    right: 20,
    zIndex: 1,
  },
  userInfo: {
    marginTop: 40,
    marginBottom: 20,
    alignItems: "center",
  },
  userName: {
    fontSize: 20,
    fontWeight: "600",
    color: "#222",
  },
  userEmail: {
    fontSize: 14,
    color: "gray",
    marginTop: 4,
  },
  heading: {
    marginTop: 30,
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
    textAlign: "center",
    color: "#222",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 15,
    marginBottom: 5,
    color: "#333",
  },
  input: {
    backgroundColor: "#fff",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  },
  submitButton: {
    marginTop: 10,
    backgroundColor: "#3c6e71",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  submittedContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  submittedText: {
    fontSize: 18,
    color: "green",
    fontWeight: "600",
    marginBottom: 15,
    textAlign: "center",
  },
  editButton: {
    backgroundColor: "#3c6e71",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  editButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
