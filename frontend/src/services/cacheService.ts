// src/services/cacheService.ts

import AsyncStorage from "@react-native-async-storage/async-storage";
import { WeeklyLog } from "../types/WeeklyLog";

const WEEKLY_LOG_CACHE = "weekly_logs_cache";

export async function saveWeeklyLogsCache(
  logs: WeeklyLog[]
): Promise<void> {
  try {
    await AsyncStorage.setItem(
      WEEKLY_LOG_CACHE,
      JSON.stringify(logs)
    );
  } catch (error) {
    console.error("Failed to save cache:", error);
  }
}

export async function loadWeeklyLogsCache(): Promise<WeeklyLog[]> {
  try {
    const cached = await AsyncStorage.getItem(WEEKLY_LOG_CACHE);

    if (!cached) return [];

    const parsed = JSON.parse(cached);

    if (!Array.isArray(parsed)) {
      await AsyncStorage.removeItem(WEEKLY_LOG_CACHE);
      return [];
    }

    return parsed;
  } catch (error) {
    console.error("Cache corrupted:", error);

    try {
      await AsyncStorage.removeItem(WEEKLY_LOG_CACHE);
    } catch {}

    return [];
  }
}

export async function clearWeeklyLogsCache(): Promise<void> {
  try {
    await AsyncStorage.removeItem(WEEKLY_LOG_CACHE);
  } catch (error) {
    console.error(error);
  }
}