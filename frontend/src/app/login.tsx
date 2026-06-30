import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ActivityIndicator } from "react-native";
import { router, Link } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { login } from "../services/authService";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      const data = await login(email, password);

      if (data.success && data.token) {
        await AsyncStorage.setItem("token", data.token);
        router.replace("/dashboard");
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || error.message || "An unexpected error occurred.";
      Alert.alert("Debug Info", errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Student Wellbeing Tracker</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#7A7A7A"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#7A7A7A"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      
      <TouchableOpacity 
        style={[styles.button, loading && styles.buttonDisabled]} 
        onPress={handleLogin} 
        disabled={loading}
        activeOpacity={0.8}
      >
        {loading ? (
          <ActivityIndicator color="#000" />
        ) : (
          <Text style={styles.buttonText}>Login</Text>
        )
      }
      </TouchableOpacity>
      
      <Link href="/register" asChild>
        <TouchableOpacity style={styles.linkContainer}>
          <Text style={styles.linkText}>Don't have an account? Register here</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: "center", 
    padding: 24, 
    backgroundColor: "#FFF9EE" // Off-white/cream canvas tint from reference
  },
  title: { 
    fontSize: 28, 
    fontWeight: "900", // Thick, heavy brutalist typography
    color: "#000000",
    marginBottom: 32, 
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  input: { 
    backgroundColor: "#FFFFFF",
    borderWidth: 3, 
    borderColor: "#000000", 
    padding: 16, 
    marginBottom: 20, 
    borderRadius: 12, 
    fontSize: 16,
    color: "#000000",
    fontWeight: "600",
    // Neo-Brutalist crisp crisp offset shadow (iOS)
    shadowColor: "#000000",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    // Android flat shadow fallback
    elevation: 0, 
  },
  button: {
    backgroundColor: "#FFDE4D", // High-contrast signature vibrant yellow
    borderWidth: 3,
    borderColor: "#000000",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    // Neo-Brutalist crisp offset shadow (iOS)
    shadowColor: "#000000",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  buttonDisabled: {
    backgroundColor: "#A3A3A3",
    shadowOffset: { width: 0, height: 0 }, // Simulates a "pressed" flat state when disabled
  },
  buttonText: {
    color: "#000000",
    fontSize: 18,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  linkContainer: {
    marginTop: 24,
    alignItems: "center",
  },
  linkText: { 
    fontSize: 14,
    fontWeight: "700",
    color: "#000000",
    textDecorationLine: "underline", // Emphasized structural navigation links
  }
});