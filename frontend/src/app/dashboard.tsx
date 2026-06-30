import { useEffect, useState } from "react";
import { View, Text, Button, ActivityIndicator, StyleSheet } from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Dashboard() {
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const checkUserAuth = async () => {
      try {
        // Retrieve the saved JWT token from phone storage
        const token = await AsyncStorage.getItem("token");

        // If no token exists, redirect straight back to login
        if (!token) {
          router.replace("/login");
          return;
        }

        // Token exists! Stop the loading screen and render the dashboard layout
        setCheckingAuth(false);
      } catch (error) {
        // If storage fails or reads corrupted data, safe-exit to login
        router.replace("/login");
      }
    };

    checkUserAuth();
  }, []);

  const handleLogout = async () => {
    // Wipe the token from storage to log the user out safely
    await AsyncStorage.removeItem("token");
    router.replace("/login");
  };

  // While checking for the token, show a clean loading spinner to prevent UI flickering
  if (checkingAuth) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4f46e5" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Dashboard</Text>
      <Text style={styles.infoText}>Welcome back! You are securely authenticated.</Text>
      
      <Button title="Log Out" color="#ef4444" onPress={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center", 
    backgroundColor: "#fff", 
    padding: 20 
  },
  centered: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center" 
  },
  welcomeText: { 
    fontSize: 28, 
    fontWeight: "bold", 
    marginBottom: 10 
  },
  infoText: { 
    fontSize: 16, 
    color: "#6b7280", 
    marginBottom: 30, 
    textAlign: "center" 
  }
});