import React, { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  RefreshControl,
  Image,
} from "react-native";
import { router, useFocusEffect } from "expo-router";

import InsightsCard from "../components/InsightsCard";
import StressMoodChart from "../components/StressMoodChart";
import SleepStudyChart from "../components/SleepStudyChart";

import { WeeklyLog } from "../types/WeeklyLog";
import { useAnalytics } from "../hooks/useAnalytics";
import { fetchWeeklyLogs } from "../services/logService";
import { secureLogout } from "../services/authService";
import { loadWeeklyLogsCache, saveWeeklyLogsCache } from "../services/cacheService";
import { initialiseNotifications } from "../services/notificationService";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Dashboard() {
  const [logs, setLogs] = useState<WeeklyLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [sessionPic, setSessionPic] = useState<string | null>(null);

  useEffect(() => {
  async function initialiseApp() {
    await initialiseNotifications();
    await initialiseDashboard();
  }

  initialiseApp();
}, []);
  useFocusEffect(
    React.useCallback(() => {
      async function syncProfilePic() {
        const cachedPic = await AsyncStorage.getItem("session_profile_pic");
        setSessionPic(cachedPic);
      }
      syncProfilePic();
    }, [])
  );

  async function initialiseDashboard() {
    // Read directly from Flash Storage Cache to bypass slow cold boot networks
    const cachedLogs = await loadWeeklyLogsCache();
    if (cachedLogs.length > 0) {
      setLogs(cachedLogs);
    }
    setLoading(false);

    // Trigger non-blocking network baseline update in background thread
    await refreshDashboard();
  }

  async function refreshDashboard() {
    try {
      setRefreshing(true);
      const response = await fetchWeeklyLogs();
      const latest = response.logs || [];

      setLogs(latest);
      await saveWeeklyLogsCache(latest);
      setIsOffline(false);
    } catch (error: any) {
      console.log(error);

      // Guard Layer: Clean down session and force boot client if token cryptographic status drops
      if (error?.response?.status === 401) {
        await secureLogout();
        router.replace("/login");
        return;
      }
      setIsOffline(true);
    } finally {
      setRefreshing(false);
    }
  }

  const insights = useAnalytics(logs);

  // Client-Side Structural Log Check: Blocks redundant backend validation hits
  const todayStr = new Date().toISOString().split("T")[0];
  const alreadyLogged = logs.some((log) => {
    const formattedLogDate = new Date(log.log_date).toISOString().split("T")[0];
    return formattedLogDate === todayStr;
  });

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#000000" />
        <Text style={styles.loadingText}>Loading Dashboard...</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl 
          refreshing={refreshing} 
          onRefresh={refreshDashboard} 
          colors={["#000000"]}
          tintColor="#000000"
        />
      }
    >
      {/* Header Section */}
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>Overview</Text>
        <TouchableOpacity 
          style={styles.profileIcon} 
          onPress={() => router.push("/profile")}
          activeOpacity={0.8}
        >
          {sessionPic ? (
            <Image 
              source={{ uri: sessionPic }} 
              style={{ width: "100%", height: "100%", borderRadius: 20 }} 
            />
          ) : (
            <Text style={styles.profileIconText}>👤</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Dynamic Neo-Brutalist Local Storage Cache Overlay Banner */}
      {isOffline && (
        <View style={styles.banner}>
          <Text style={styles.bannerText}>⚠️ Using cached data (Offline mode)</Text>
        </View>
      )}

      {/* Main Call-to-Action Check-In Button Container */}
      <TouchableOpacity
        style={[
          styles.button, 
          alreadyLogged && styles.buttonDisabled
        ]}
        onPress={() => router.push("/checkin")}
        activeOpacity={alreadyLogged ? 1 : 0.8}
        disabled={alreadyLogged}
      >
        <Text style={styles.buttonText}>
          {alreadyLogged ? "✓ Today's Check-In Complete" : "Complete Daily Check-In"}
        </Text>
      </TouchableOpacity>

      <InsightsCard insights={insights} />
      <StressMoodChart logs={logs} />
      <SleepStudyChart logs={logs} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF9EE",
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
    fontWeight: "900", 
    color: "#000000",
    textTransform: "uppercase", 
    letterSpacing: 0.5,
  },
  profileIcon: { 
    backgroundColor: "#54D2F2", 
    width: 46, 
    height: 46, 
    borderRadius: 23, 
    borderWidth: 3,
    borderColor: "#000000",
    justifyContent: "center", 
    alignItems: "center",
    shadowColor: "#000000",
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  profileIconText: { 
    fontSize: 22 
  },
  banner: {
    backgroundColor: "#FFB142", // Vivid structural orange accent palette choice
    padding: 14,
    borderWidth: 3,
    borderColor: "#000000",
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: "#000000",
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  bannerText: {
    textAlign: "center",
    fontWeight: "900",
    color: "#000000",
    textTransform: "uppercase",
    fontSize: 13,
    letterSpacing: 0.5
  },
  button: {
    backgroundColor: "#FFDE4D", 
    padding: 18,
    borderWidth: 3,
    borderColor: "#000000",
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 24,
    shadowColor: "#000000",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  buttonDisabled: {
    backgroundColor: "#10B981", // High-contrast emerald execution success state
    shadowOffset: { width: 0, height: 0 }, // Complete drop down flat design response 
  },
  buttonText: {
    color: "#000000",
    fontWeight: "900",
    fontSize: 16,
    textTransform: "uppercase", 
    letterSpacing: 0.5,
  },
});