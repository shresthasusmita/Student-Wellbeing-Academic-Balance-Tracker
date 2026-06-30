import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

// Display notifications while the app is open
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

/**
 * Request notification permission
 */
export async function requestNotificationPermission(): Promise<boolean> {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      console.log("Notification permission denied.");
      return false;
    }

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("daily-reminders", {
        name: "Daily Reminders",
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#2563EB",
      });
    }

    return true;
  } catch (error) {
    console.error("Permission error:", error);
    return false;
  }
}

/**
 * TESTING VERSION
 * Fires 60 seconds after scheduling.
 */
export async function scheduleDailyReminder() {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Daily Wellbeing Check-in",
        body: "Take 60 seconds to log your mood and sleep today.",
        sound: false,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 60,
      },
    });

    console.log("Reminder scheduled in 60 seconds.");
  } catch (error) {
    console.error("Failed to schedule reminder:", error);
  }
}

/**
 * FINAL SUBMISSION VERSION
 *
 * Replace the function above with this before submission.
 */
/*
export async function scheduleDailyReminder() {
  try {
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
  } catch (error) {
    console.error(error);
  }
}
*/

/** * Logout cleanup
 */
export async function cancelDailyReminders() {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (error) {
    console.error(error);
  }
}

/**
 * Initialise notifications 
 */
export async function initialiseNotifications() {
  const granted = await requestNotificationPermission();
  if (!granted) return;
  await scheduleDailyReminder();
}