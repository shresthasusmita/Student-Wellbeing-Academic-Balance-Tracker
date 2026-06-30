// src/app/dashboard.tsx

import React, { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";

import { router } from "expo-router";

import InsightsCard from "../components/InsightsCard";
import StressMoodChart from "../components/StressMoodChart";
import SleepStudyChart from "../components/SleepStudyChart";

import { WeeklyLog } from "../types/WeeklyLog";
import { useAnalytics } from "../hooks/useAnalytics";
import { fetchWeeklyLogs } from "../services/logService";

export default function Dashboard() {
  const [logs, setLogs] = useState<WeeklyLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWeeklyLogs();
  }, []);

  async function loadWeeklyLogs() {
    try {
      const data = await fetchWeeklyLogs();
      setLogs(data.logs || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  const insights = useAnalytics(logs);

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#000000" />
        <Text style={styles.loadingText}>Loading Dashboard...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header Section */}
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>Overview</Text>
        <TouchableOpacity 
          style={styles.profileIcon} 
          onPress={() => router.push("/profile")}
          activeOpacity={0.8}
        >
          <Text style={styles.profileIconText}>👤</Text>
        </TouchableOpacity>
      </View>

      {/* Main Call-to-Action Check-In Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/checkin")}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>
          Complete Daily Check-In
        </Text>
      </TouchableOpacity>

      {/* Analytics & Layout Component Blocks */}
      {/* Note: Pass any brutalist styling flags down if these components support custom styling */}
      <InsightsCard insights={insights} />

      <StressMoodChart logs={logs} />

      <SleepStudyChart logs={logs} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF9EE", // Tinted light cream background matching the reference frame
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF9EE",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: "700",
    color: "#000000",
  },
  headerRow: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center", 
    marginBottom: 26, 
    marginTop: 12 
  },
  headerTitle: { 
    fontSize: 32, 
    fontWeight: "900", // Heavy structural text emphasis
    color: "#000000",
    textTransform: "uppercase", // Clean brutalist styling standard
    letterSpacing: 0.5,
  },
  profileIcon: { 
    backgroundColor: "#54D2F2", // Bright structural contrast cyan from reference button accents
    width: 46, 
    height: 46, 
    borderRadius: 23, 
    borderWidth: 3,
    borderColor: "#000000",
    justifyContent: "center", 
    alignItems: "center",
    // Clean flat offset shadow mechanics (iOS)
    shadowColor: "#000000",
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  profileIconText: { 
    fontSize: 22 
  },
  button: {
    backgroundColor: "#FFDE4D", // High-visibility bright yellow core container color
    padding: 18,
    borderWidth: 3,
    borderColor: "#000000",
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 24,
    // Crisp structural drop shadow block (iOS)
    shadowColor: "#000000",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  buttonText: {
    color: "#000000",
    fontWeight: "900",
    fontSize: 16,
    textTransform: "uppercase", // High-contrast structural action labels
    letterSpacing: 0.5,
  },
});