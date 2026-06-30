import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

// Configure notification behaviour
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

/**
 * Requests notification permission.
 * Returns true if permission has been granted.
 */
export async function requestNotificationPermission(): Promise<boolean> {
  try {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();

    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } =
        await Notifications.requestPermissionsAsync();

      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      console.log("Notification permission denied.");
      return false;
    }

    // Android notification channel (required)
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("daily-reminders", {
        name: "Daily Reminders",
        importance: Notifications.AndroidImportance.DEFAULT,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#2563EB",
      });
    }

    return true;
  } catch (error) {
    console.error("Notification permission error:", error);
    return false;
  }
}

/**
 * Schedules a daily reminder at 8:00 PM.
 */
export async function scheduleDailyReminder(): Promise<void> {
  try {
    // Prevent duplicate reminders
    await Notifications.cancelAllScheduledNotificationsAsync();

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Daily Wellbeing Check-in",
        body: "Take 60 seconds to log your mood and sleep today.",
        sound: false,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: 20,
        minute: 0,
      },
    });

    console.log("Daily reminder scheduled.");
  } catch (error) {
    console.error("Failed to schedule reminder:", error);
  }
}

/**
 * Cancels all scheduled reminders.
 * Call this during logout.
 */
export async function cancelDailyReminders(): Promise<void> {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (error) {
    console.error("Failed to cancel notifications:", error);
  }
}

/**
 * Initialises notifications after login.
 */
export async function initialiseNotifications(): Promise<void> {
  const granted = await requestNotificationPermission();

  if (!granted) return;

  await scheduleDailyReminder();
}