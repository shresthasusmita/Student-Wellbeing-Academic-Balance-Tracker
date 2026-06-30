import { useState } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";
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

    setLoading(false);
    try {
      setLoading(true);
      // 1. Call the frontend service to hit the backend API
      const data = await login(email, password);

      if (data.success && data.token) {
        // 2. Store the JWT token on the phone's storage
        await AsyncStorage.setItem("token", data.token);
        
        // 3. Cleanly navigate to the protected dashboard
        router.replace("/dashboard");
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Invalid email or password";
      Alert.alert("Login Failed", errorMsg);
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
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      
      <Button title={loading ? "Logging in..." : "Login"} onPress={handleLogin} disabled={loading} />
      
      <Link href="/register" style={styles.link}>
        <Text>Don't have an account? Register here</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, marginBottom: 15, borderRadius: 5 },
  link: { marginTop: 15, textAlign: "center", color: "blue" }
});