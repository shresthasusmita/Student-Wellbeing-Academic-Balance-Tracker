import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, SafeAreaView, Image } from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { fetchUserProfile, secureLogout } from "../services/authService";
import { cancelDailyReminders } from "../services/notificationService";

interface UserProfile {
  name: string;
  email: string;
}

export default function ProfileScreen() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [profilePic, setProfilePic] = useState<string | null>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      // 1. Fetch user data from backend
      const data = await fetchUserProfile();
      if (data.success) {
        setUser(data.user);
      }

      // 2. Fetch session-based profile photo path if it exists
      const cachedPic = await AsyncStorage.getItem("session_profile_pic");
      if (cachedPic) {
        setProfilePic(cachedPic);
      }
    } catch (error) {
      console.error("Failed to load profile", error);
      Alert.alert("Session Expired", "Please log in again.");
      router.replace("/login");
    } finally {
      setLoading(false);
    }
  }

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "We need camera roll permissions to upload a profile photo.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.6,
    });

    if (!result.canceled && result.assets[0].uri) {
      const selectedUri = result.assets[0].uri;
      setProfilePic(selectedUri);
      await AsyncStorage.setItem("session_profile_pic", selectedUri);
    }
  };

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
            await cancelDailyReminders();
            // CRITICAL UX PERSISTENCE CLEANUP: Purge the session photo path entirely on exit
            await AsyncStorage.removeItem("session_profile_pic");
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
      {/* Refactored Header Layout */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => router.back()} 
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Text style={styles.backText}>← DASHBOARD</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Account Profile</Text>
      </View>

      {/* Interactive Profile Avatar Picker Area */}
      <View style={styles.avatarContainer}>
        <TouchableOpacity 
          onPress={pickImage} 
          style={styles.avatarFrame}
          activeOpacity={0.9}
        >
          {profilePic ? (
            <Image source={{ uri: profilePic }} style={styles.avatarImage} />
          ) : (
            <Text style={styles.avatarPlaceholderText}>👤</Text>
          )}
          {/* Action corner badge element */}
          <View style={styles.addPhotoBadge}>
            <Text style={styles.addPhotoBadgeText}>+</Text>
          </View>
        </TouchableOpacity>
        <Text style={styles.avatarHintText}>TAP TO EDIT PHOTO</Text>
      </View>

      {/* Profile Details Container */}
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
    backgroundColor: "#FFF9EE" 
  },
  center: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center",
    backgroundColor: "#FFF9EE" 
  },
  header: { 
    paddingHorizontal: 24, 
    paddingTop: 16,
    marginBottom: 10
  },
  backButton: { 
    alignSelf: "flex-start",
    backgroundColor: "#54D2F2", 
    borderWidth: 3,
    borderColor: "#000000",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginBottom: 18,
    shadowColor: "#000000",
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  backText: { 
    color: "#000000", 
    fontSize: 13, 
    fontWeight: "900",
    letterSpacing: 0.5
  },
  title: { 
    fontSize: 32, 
    fontWeight: "900", 
    color: "#000000",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  avatarContainer: {
    alignItems: "center",
    marginVertical: 16,
  },
  avatarFrame: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#FFDE4D", // Accent yellow to pop out elegantly
    borderWidth: 3,
    borderColor: "#000000",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    shadowColor: "#000000",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    borderRadius: 52,
  },
  avatarPlaceholderText: {
    fontSize: 50,
  },
  addPhotoBadge: {
    position: "absolute",
    bottom: -2,
    right: -2,
    backgroundColor: "#54D2F2",
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#000000",
    justifyContent: "center",
    alignItems: "center",
  },
  addPhotoBadgeText: {
    color: "#000000",
    fontSize: 18,
    fontWeight: "900",
    marginTop: -2,
  },
  avatarHintText: {
    marginTop: 14,
    fontSize: 11,
    fontWeight: "800",
    color: "#000000",
    letterSpacing: 0.5,
  },
  card: { 
    backgroundColor: "#FFFFFF", 
    marginHorizontal: 24, 
    padding: 24, 
    borderRadius: 12, 
    borderWidth: 3,
    borderColor: "#000000",
    shadowColor: "#000000", 
    shadowOffset: { width: 4, height: 4 }, 
    shadowOpacity: 1, 
    shadowRadius: 0,
    marginTop: 10
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
    backgroundColor: "#FF5A5A", 
    padding: 18, 
    borderRadius: 12, 
    alignItems: "center", 
    marginTop: 24,
    borderWidth: 3,
    borderColor: "#000000",
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