import api from "./api";
import AsyncStorage from "@react-native-async-storage/async-storage";

// ---------------------------------------------------------------------------
// JSON Payload Contract
// Enforcing strict AT2 typing so the React Native UI cannot send malformed data
// ---------------------------------------------------------------------------
export interface DailyLogPayload {
  mood: number;         // 1-5
  stress: number;       // 1-5
  sleep_hours: number;  // 0.0 - 24.0
  study_hours: number;  // 0.0 - 24.0
  notes?: string;       // Optional, max 500 chars
  log_date: string;     // YYYY-MM-DD
}

/**
 * Helper function to securely retrieve the JWT and format the Authorization header
 */
const getAuthHeader = async () => {
  const token = await AsyncStorage.getItem("token");
  
  if (!token) {
    throw new Error("Authentication token missing. Please log in again.");
  }

  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

/**
 * Submits a new daily wellbeing log to the MySQL backend
 */
export async function submitDailyLog(payload: DailyLogPayload) {
  const config = await getAuthHeader();
  
  // Fires the exact JSON payload contract to the protected POST endpoint
  const response = await api.post("/logs", payload, config);
  return response.data;
}

/**
 * Fetches the rolling 7-day logs to power the analytics dashboard
 */
export async function fetchWeeklyLogs() {
  const config = await getAuthHeader();
  
  // Hits the protected GET endpoint for historical time-series data
  const response = await api.get("/logs/weekly", config);
  return response.data;
}