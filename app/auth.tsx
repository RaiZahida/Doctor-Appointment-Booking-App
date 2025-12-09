import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import {
  TextInput,
  Button,
  IconButton,
  MD3Colors,
} from "react-native-paper";
import { useAuth } from "../auth-context";
import { useRouter } from "expo-router";

export default function Auth() {
  const { login, register, user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  // Redirect based on user role
  useEffect(() => {
    if (user) {
      if (user.role === "admin") {
        router.replace("/(tabs)/home");
      } else {
        router.replace("/(tabs)/home");
      }
    }
  }, [user]);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Enter email and password");
      return;
    }

    try {
      setLoading(true);
      await login(email, password);
      setError("");
      console.log(user)
      if(user==null){
        setError("Invalid credentials")
      }
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!name || !email || !password) {
      setError("Fill all fields");
      return;
    }

    try {
      setLoading(true);
      await register(email, password, name);
      setError("");
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <View style={styles.centered}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          {isRegister ? (
            <>
              <IconButton
                icon="close"
                size={28}
                onPress={() => setIsRegister(false)}
                style={{ position: "absolute", top: -50, right: 5 }}
              />

              <Text style={styles.title}>Create Account</Text>

              <TextInput
                label="Name"
                value={name}
                onChangeText={setName}
                style={styles.input}
                mode="outlined"
              />

              <TextInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                mode="outlined"
                autoCapitalize="none"
                keyboardType="email-address"
                style={styles.input}
              />

              <TextInput
                label="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                autoCapitalize="none"
                style={styles.input}
                mode="outlined"
              />

              {error ? <Text style={styles.error}>{error}</Text> : null}

              <Button
                mode="contained"
                loading={loading}
                onPress={handleRegister}
                style={styles.button}
              >
                {loading ? "Registering..." : "Register"}
              </Button>

              <Button
                onPress={() => {
                  setIsRegister(false);
                  setError("");
                }}
                style={styles.button}
              >
                Already have an account? Sign In
              </Button>
            </>
          ) : (
            <>
              <IconButton
                icon="close"
                size={28}
                onPress={() => router.replace("/")}
                style={{ position: "absolute", top: -50, right: 5 }}
              />

              <Text style={styles.title}>Sign In</Text>

              <TextInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                mode="outlined"
                style={styles.input}
              />

              <TextInput
                label="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                autoCapitalize="none"
                mode="outlined"
                style={styles.input}
              />

              {error ? <Text style={styles.error}>{error}</Text> : null}

              <Button
                mode="contained"
                loading={loading}
                onPress={handleLogin}
                style={styles.button}
              >
                {loading ? "Signing In..." : "Sign In"}
              </Button>

              <Button
                onPress={() => {
                  setIsRegister(true);
                  setError("");
                }}
                style={styles.button}
              >
                Don't have an account? Create Account
              </Button>
            </>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  container: {
    alignItems: "center",
    width: "100%",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    width: "100%",
    marginBottom: 12,
  },
  button: {
    width: "100%",
    marginVertical: 5,
  },
  title: {
    fontSize: 30,
    marginBottom: 25,
    fontWeight: "600",
  },
  error: {
    color: MD3Colors.error50,
    textAlign: "left",
    width: "100%",
    marginBottom: 10,
    fontSize: 14,
    fontWeight: "500",
  },
});
