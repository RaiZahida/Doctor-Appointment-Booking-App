import { View, Text, StyleSheet, FlatList } from "react-native";
import { useEffect, useState } from "react";
import { IconButton, Card } from "react-native-paper";
import { router } from "expo-router";
import { databases } from "../../lib/appwrite"; // adjust path if needed

const DATABASE_ID = "692923c0000e958a6532";
const CLINICS_COLLECTION_ID = "clinics";
const DOCTORS_COLLECTION_ID = "doctors";

export default function Clinics() {
  const [clinics, setClinics] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchClinics = async () => {
    try {
      const clinicRes = await databases.listDocuments(DATABASE_ID, CLINICS_COLLECTION_ID);
      setClinics(clinicRes.documents);

      const doctorRes = await databases.listDocuments(DATABASE_ID, DOCTORS_COLLECTION_ID);
      setDoctors(doctorRes.documents);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClinics();
  }, []);

  const renderClinic = ({ item }) => {
    // ✅ Move the filtering outside JSX
    const clinicDoctors = doctors.filter(doc => doc.clinicId === item.$id);

    return (
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.clinicName}>{item.name}</Text>
          <Text style={styles.clinicText}>{item.address}</Text>
          {item.phone ? <Text style={styles.clinicText}>📞 {item.phone}</Text> : null}

          {clinicDoctors.length > 0 && (
            <View style={{ marginTop: 8 }}>
              <Text style={{ fontWeight: "600", marginBottom: 4 }}>Doctors:</Text>
              {clinicDoctors.map(doc => (
                <Text key={doc.$id} style={styles.clinicText}>•Dr. {doc.firstName} {doc.lastName}</Text>
              ))}
            </View>
          )}
        </Card.Content>
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      {/* ❌ Cross Button */}
     


      <FlatList
        data={clinics}
        keyExtractor={(item) => item.$id}
        renderItem={renderClinic}
        contentContainerStyle={{ paddingBottom: 40 }}
        ListEmptyComponent={
          !loading && (
            <Text style={styles.emptyText}>No clinics added yet.</Text>
          )
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexGrow: 1,
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
    marginBottom: 20,
    marginTop: 10,
    fontSize: 18,
  },
  card: {
    marginBottom: 12,
    borderRadius: 14,
    elevation: 4,
    backgroundColor: "#fff",
  },
  clinicName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  clinicText: {
    fontSize: 14,
    color: "#555",
    marginBottom: 2,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    color: "#888",
  },
});
