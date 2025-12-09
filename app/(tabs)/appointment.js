import { useEffect, useState } from "react";
import { databases } from "../../lib/appwrite";
import { Query } from "react-native-appwrite";
import { useAuth } from "../../auth-context";
import { View, Text, FlatList, TouchableOpacity, TextInput } from "react-native";

export default function Appointments() {
  console.log("Appointment screen mounted");
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // ⭐ New state for date filter
  const [filterDate, setFilterDate] = useState("");
  const specializations = [
    { name: "Cardiologist", icon: "heart", id: "6931563e00352cb0363a" },
    { name: "Dentist", icon: "tooth", id: "6932a38d0023ca5f8e5f" },
    { name: "Neurologist", icon: "brain", id: "6932a418002b9b0b92bb" },
    { name: "General", icon: "user-md", id: "693157aa001878172af0" },
    { name: "Pediatrician", icon: "baby", id: "6932a4a3002963dd6705" },
  ];
  const handleCancel = async (appointmentId) => {
    try {
      await databases.updateDocument(
        "692923c0000e958a6532",
        "appointment",
        appointmentId,
        { status: "cancelled" }
      );

      getAppointments();
    } catch (err) {
      console.log("Cancel error:", err);
    }
  };

  const getDoctor = async (doctorId) => {
    try {
      console.log("Doctor ID coming from appointment:", doctorId);

      const doctor = await databases.getDocument(
        "692923c0000e958a6532",
        "doctors",
        doctorId
      );
      return doctor;
    } catch (err) {
      console.log("Error fetching doctor:", err);
      return null;
    }
  };

  // ⭐ Modified to include date filter + admin logic
  const getAppointments = async () => {
    try {
      let queries = [];

      // Admin → all appointments
      if (user?.role === "admin") {
        console.log("Admin: Fetching ALL appointments");
      } 
      // Normal user → their own only
      else {
        console.log("User: Fetching OWN appointments only");
        queries.push(Query.equal("userId", user.$id));
      }

      // ⭐ If a date filter is selected
      if (filterDate.trim() !== "") {
        console.log("Applying date filter:", filterDate);
        queries.push(Query.equal("date", filterDate));
      }

      const res = await databases.listDocuments(
        "692923c0000e958a6532",
        "appointment",
        queries
      );

      // Fetch doctor info
      const updated = await Promise.all(
        res.documents.map(async (item) => {
          if (item.doctorId) {
            const doctor = await getDoctor(item.doctorId);
            // console.log("Doctor ID:", item.doctorId);

            return { ...item, doctor };
          }
          return item;
        })
      );

      setAppointments(updated);
    } catch (err) {
      console.error("Error fetching appointments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) getAppointments();
  }, [user, filterDate]); // refresh whenever date filter changes

  return (
    <View style={{ flex: 1, padding: 15 }}>
      
      {/* ⭐ Date Filter Input */}
      <Text style={{ fontSize: 16, fontWeight: "600", marginBottom: 8 }}>
        Filter by Date (yyyy-mm-dd):
      </Text>

      <TextInput
        placeholder="2024-12-07"
        value={filterDate}
        onChangeText={setFilterDate}
        style={{
          backgroundColor: "#fff",
          padding: 12,
          borderRadius: 10,
          marginBottom: 15,
          borderWidth: 1,
          borderColor: "#999",
        }}
      />

      {/* Clear Filter Button */}
      {filterDate !== "" && (
        <TouchableOpacity
          onPress={() => setFilterDate("")}
          style={{
            backgroundColor: "#444",
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderRadius: 8,
            marginBottom: 12,
            alignSelf: "flex-start",
          }}
        >
          <Text style={{ color: "white", fontWeight: "600" }}>Clear Filter</Text>
        </TouchableOpacity>
      )}

      <FlatList
        data={appointments}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <View
            style={{
              backgroundColor: "white",
              padding: 18,
              marginBottom: 15,
              borderRadius: 16,
              shadowColor: "#000",
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            {/* Patient + Status */}
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={{ fontSize: 17, fontWeight: "700", color: "#333" }}>
                {item.name}
              </Text>

              <Text
                style={{
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                  borderRadius: 12,
                  backgroundColor:
                    item.status === "scheduled"
                      ? "#d1e7ff"
                      : item.status === "completed"
                      ? "#d4edda"
                      : "#f8d7da",
                  color:
                    item.status === "scheduled"
                      ? "#0c63e7"
                      : item.status === "completed"
                      ? "#2d6a4f"
                      : "#842029",
                  fontWeight: "600",
                  textTransform: "capitalize",
                }}
              >
                {item.status}
              </Text>
            </View>

            {/* Doctor Info */}
            {item.doctor && (
              <View style={{ marginTop: 10 }}>
           <Text style={{ fontSize: 16, fontWeight: "600", color: "#444" }}>
                  Doctor: <Text style={{ fontWeight: "400" }}>{item.doctor.name}</Text>
                </Text>
                <Text style={{ fontSize: 15, color: "#555", marginTop: 2 }}>
  Specialization: {
    specializations.find((s) => s.id === item.doctor.specializationId)?.name 
      || "Unknown"
  }
</Text>

              </View>
            )}

            {/* Appointment Info */}
            <View style={{ marginTop: 10 }}>
              <Text style={{ fontSize: 15, color: "#333" }}>
                📅 Date: <Text style={{ fontWeight: "500" }}>{item.date}</Text>
              </Text>
              <Text style={{ fontSize: 15, marginTop: 3, color: "#333" }}>
                ⏰ Time: <Text style={{ fontWeight: "500" }}>{item.time}</Text>
              </Text>
            </View>

            {/* Cancel */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                marginTop: 15,
              }}
            >
              <TouchableOpacity
                onPress={() => handleCancel(item.$id)}
                style={{
                  backgroundColor: "#ff4d4d",
                  paddingHorizontal: 14,
                  paddingVertical: 8,
                  borderRadius: 10,
                }}
              >
                <Text style={{ color: "white", fontWeight: "600" }}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}
