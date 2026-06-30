import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, SafeAreaView } from "react-native";
import { router } from "expo-router";
import { fetchUserProfile, secureLogout } from "../services/authService";

interface UserProfile {
  name: string;
  email: string;
}

export default function ProfileScreen() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      const data = await fetchUserProfile();
      if (data.success) {
        setUser(data.user);
      }
    } catch (error) {
      console.error("Failed to load profile", error);
      Alert.alert("Session Expired", "Please log in again.");
      router.replace("/login");
    } finally {
      setLoading(false);
    }
  }

  const handleLogout = () => {
    Alert.alert(
      "Secure Logout",
      "Are you sure you want to end your session?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Logout", 
          style: "destructive",
          onPress: async () => {
            await secureLogout();
            router.replace("/login");
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#000000" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => router.back()} 
          style={styles.backButton}
          activeOpacity={0.8}
        >
          <Text style={styles.backText}>← Back to Dashboard</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Account Profile</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Full Name</Text>
        <Text style={styles.value}>{user?.name || "N/A"}</Text>

        <View style={styles.divider} />

        <Text style={styles.label}>University Email</Text>
        <Text style={styles.value}>{user?.email || "N/A"}</Text>
        
        <View style={styles.divider} />

        <Text style={styles.label}>App Version</Text>
        <Text style={styles.value}>v1.0 (AT3 Release)</Text>
      </View>

      <TouchableOpacity 
        style={styles.logoutButton} 
        onPress={handleLogout}
        activeOpacity={0.8}
      >
        <Text style={styles.logoutText}>Secure Logout</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#FFF9EE" // Tinted cream canvas background from reference frame
  },
  center: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center",
    backgroundColor: "#FFF9EE" 
  },
  header: { 
    padding: 24, 
    paddingTop: 20 
  },
  backButton: { 
    alignSelf: "flex-start",
    backgroundColor: "#54D2F2", // Accent sky blue matching button components in reference image
    borderWidth: 2,
    borderColor: "#000000",
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginBottom: 16,
    shadowColor: "#000000",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  backText: { 
    color: "#000000", 
    fontSize: 14, 
    fontWeight: "800" 
  },
  title: { 
    fontSize: 32, 
    fontWeight: "900", 
    color: "#000000",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  card: { 
    backgroundColor: "#FFFFFF", 
    marginHorizontal: 24, 
    padding: 24, 
    borderRadius: 12, 
    borderWidth: 3,
    borderColor: "#000000",
    // Rigid Neo-brutalist offset block shadow (iOS)
    shadowColor: "#000000", 
    shadowOffset: { width: 4, height: 4 }, 
    shadowOpacity: 1, 
    shadowRadius: 0,
  },
  label: { 
    fontSize: 12, 
    color: "#000000", 
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4 
  },
  value: { 
    fontSize: 18, 
    color: "#000000", 
    fontWeight: "900" 
  },
  divider: { 
    height: 3, 
    backgroundColor: "#000000", 
    marginVertical: 18 
  },
  logoutButton: { 
    marginHorizontal: 24, 
    backgroundColor: "#FF5A5A", // Eye-catching high-contrast structural warning red
    padding: 18, 
    borderRadius: 12, 
    alignItems: "center", 
    marginTop: 20,
    borderWidth: 3,
    borderColor: "#000000",
    // Rigid Neo-brutalist offset block shadow (iOS)
    shadowColor: "#000000",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  logoutText: { 
    color: "#000000", 
    fontWeight: "900", 
    fontSize: 16,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  }
});