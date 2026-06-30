import { useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Alert, 
  StyleSheet, 
  ScrollView, 
  SafeAreaView, 
  ActivityIndicator 
} from "react-native";
import { router, Link } from "expo-router";
import { register } from "../services/authService";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    // 1. Basic Client-Side Validation
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert("Validation Error", "Please fill in all mandatory profile fields.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Validation Error", "Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Validation Error", "Password must be at least 6 characters long.");
      return;
    }

    try {
      setLoading(true);
      // 2. Dispatch payload to the /api/auth/register backend layer
      const data = await register(name, email, password);

      if (data.success) {
        Alert.alert(
          "Registration Successful", 
          "Your student wellbeing account has been created! Please log in.",
          [{ text: "OK", onPress: () => router.replace("/login") }]
        );
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Registration failed. Please check your credentials.";
      Alert.alert("Registration Error", errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Set up your academic balance tracking profile</Text>
        
        <View style={styles.formCard}>
          <Text style={styles.inputLabel}>Full Name</Text>
          <TextInput
            style={styles.input}
            placeholder="John Doe"
            placeholderTextColor="#7A7A7A"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />

          <Text style={styles.inputLabel}>University Email Address</Text>
          <TextInput
            style={styles.input}
            placeholder="student@test.com"
            placeholderTextColor="#7A7A7A"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          
          <Text style={styles.inputLabel}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            placeholderTextColor="#7A7A7A"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <Text style={styles.inputLabel}>Confirm Password</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            placeholderTextColor="#7A7A7A"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
          
          <TouchableOpacity 
            style={[styles.button, loading && styles.buttonDisabled]} 
            onPress={handleRegister} 
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#000000" />
            ) : (
              <Text style={styles.buttonText}>Register</Text>
            )}
          </TouchableOpacity>
        </View>
        
        <Link href="/login" asChild>
          <TouchableOpacity style={styles.linkContainer}>
            <Text style={styles.linkText}>Already have an account? Log in here</Text>
          </TouchableOpacity>
        </Link>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#FFF9EE" // Tinted cream canvas background matching user layouts
  },
  scrollContent: { 
    padding: 24, 
    justifyContent: "center" 
  },
  title: { 
    fontSize: 32, 
    fontWeight: "900", 
    color: "#000000", 
    textAlign: "center", 
    marginTop: 10,
    textTransform: "uppercase",
    letterSpacing: 0.5
  },
  subtitle: { 
    fontSize: 15, 
    color: "#000000", 
    fontWeight: "700",
    textAlign: "center", 
    marginTop: 6, 
    marginBottom: 28 
  },
  formCard: { 
    backgroundColor: "#FFFFFF", 
    padding: 24, 
    borderRadius: 16, 
    borderWidth: 3,
    borderColor: "#000000",
    // Crisp geometric block shadow mechanics (iOS)
    shadowColor: "#000000", 
    shadowOffset: { width: 4, height: 4 }, 
    shadowOpacity: 1, 
    shadowRadius: 0,
    marginBottom: 8
  },
  inputLabel: { 
    fontSize: 12, 
    fontWeight: "800", 
    color: "#000000", 
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 0.5
  },
  input: { 
    borderWidth: 2, 
    borderColor: "#000000", 
    padding: 14, 
    marginBottom: 20, 
    borderRadius: 10, 
    fontSize: 16, 
    backgroundColor: "#FFFFFF", 
    color: "#000000",
    fontWeight: "600"
  },
  button: {
    backgroundColor: "#FFDE4D", // High-contrast signature container yellow
    borderWidth: 3,
    borderColor: "#000000",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    // Crisp directional shadow line (iOS)
    shadowColor: "#000000",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  buttonDisabled: {
    backgroundColor: "#A3A3A3",
    shadowOffset: { width: 0, height: 0 } // Flattens panel offset state when locked
  },
  buttonText: {
    color: "#000000",
    fontSize: 18,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 0.5
  },
  linkContainer: { 
    marginTop: 20, 
    alignItems: "center" 
  },
  linkText: { 
    color: "#000000", 
    textAlign: "center", 
    fontSize: 14, 
    fontWeight: "700",
    textDecorationLine: "underline" // Emphasized clean text anchor mapping
  }
});