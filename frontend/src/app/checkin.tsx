import React, { useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  Pressable, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  Alert,
  ActivityIndicator
} from "react-native";
import { router } from "expo-router";
import { submitDailyLog } from "../services/logService";

export default function CheckInScreen() {
  // ---------------------------------------------------------------------------
  // State Management (Pre-populated with neutral defaults for speed)
  // ---------------------------------------------------------------------------
  const [mood, setMood] = useState<number>(3);
  const [stress, setStress] = useState<number>(3);
  const [sleepHours, setSleepHours] = useState<number>(7.0);
  const [studyHours, setStudyHours] = useState<number>(4.0);
  const [notes, setNotes] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Array index maps to 1-5 scale: [1: Very Bad, 2: Bad, 3: Neutral, 4: Good, 5: Excellent]
  const moodEmojis = ["😔", "😕", "😐", "🙂", "😄"];

  // ---------------------------------------------------------------------------
  // Submission Handler
  // ---------------------------------------------------------------------------
  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Generate YYYY-MM-DD string for MySQL compatibility
    const today = new Date().toISOString().split("T")[0];

    try {
      await submitDailyLog({
        mood,
        stress,
        sleep_hours: sleepHours,
        study_hours: studyHours,
        notes: notes.trim(),
        log_date: today
      });

      // Navigate back to dashboard and destroy the check-in history stack
      router.replace("/dashboard");
    } catch (error: any) {
      // Gracefully catch the 409 Conflict (Duplicate Entry) or 400 Validation errors
      const errorMessage = error.response?.data?.message || "Failed to submit log. Please try again.";
      Alert.alert("Submission Failed", errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function for quick Stepper adjustments
  const adjustValue = (
    setter: React.Dispatch<React.SetStateAction<number>>, 
    current: number, 
    amount: number, 
    min: number, 
    max: number
  ) => {
    const newValue = current + amount;
    if (newValue >= min && newValue <= max) {
      setter(newValue);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.headerTitle}>Daily Check-In</Text>
        <Text style={styles.subHeader}>How are you feeling today?</Text>

        {/* 1. MOOD - Emoji Taps */}
        <View style={styles.card}>
          <Text style={styles.label}>Mood</Text>
          <View style={styles.emojiContainer}>
            {moodEmojis.map((emoji, index) => {
              const value = index + 1;
              const isSelected = mood === value;
              return (
                <Pressable 
                  key={value} 
                  onPress={() => setMood(value)}
                  style={[styles.emojiBtn, isSelected && styles.emojiBtnSelected]}
                >
                  <Text style={styles.emojiText}>{emoji}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* 2. STRESS - Integer Stepper */}
        <View style={styles.card}>
          <Text style={styles.label}>Stress Level (1-5)</Text>
          <View style={styles.stepperContainer}>
            <Pressable style={styles.stepperBtn} onPress={() => adjustValue(setStress, stress, -1, 1, 5)}>
              <Text style={styles.stepperSymbol}>-</Text>
            </Pressable>
            <Text style={styles.stepperValue}>{stress}</Text>
            <Pressable style={styles.stepperBtn} onPress={() => adjustValue(setStress, stress, 1, 1, 5)}>
              <Text style={styles.stepperSymbol}>+</Text>
            </Pressable>
          </View>
        </View>

        {/* 3. SLEEP - Float Stepper (0.5 increments) */}
        <View style={styles.card}>
          <Text style={styles.label}>Sleep Hours</Text>
          <View style={styles.stepperContainer}>
            <Pressable style={styles.stepperBtn} onPress={() => adjustValue(setSleepHours, sleepHours, -0.5, 0, 24)}>
              <Text style={styles.stepperSymbol}>-</Text>
            </Pressable>
            <Text style={styles.stepperValue}>{sleepHours.toFixed(1)}</Text>
            <Pressable style={styles.stepperBtn} onPress={() => adjustValue(setSleepHours, sleepHours, 0.5, 0, 24)}>
              <Text style={styles.stepperSymbol}>+</Text>
            </Pressable>
          </View>
        </View>

        {/* 4. STUDY - Float Stepper (0.5 increments) */}
        <View style={styles.card}>
          <Text style={styles.label}>Study Hours</Text>
          <View style={styles.stepperContainer}>
            <Pressable style={styles.stepperBtn} onPress={() => adjustValue(setStudyHours, studyHours, -0.5, 0, 24)}>
              <Text style={styles.stepperSymbol}>-</Text>
            </Pressable>
            <Text style={styles.stepperValue}>{studyHours.toFixed(1)}</Text>
            <Pressable style={styles.stepperBtn} onPress={() => adjustValue(setStudyHours, studyHours, 0.5, 0, 24)}>
              <Text style={styles.stepperSymbol}>+</Text>
            </Pressable>
          </View>
        </View>

        {/* 5. NOTES - Optional Text */}
        <View style={styles.card}>
          <Text style={styles.label}>Notes (Optional)</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Any context for today?"
            placeholderTextColor="#9ca3af"
            value={notes}
            onChangeText={setNotes}
            maxLength={500}
            multiline
            numberOfLines={3}
          />
        </View>

        {/* SUBMIT BUTTON */}
        <Pressable 
          style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]} 
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.submitButtonText}>Save Daily Log</Text>
          )}
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

// ---------------------------------------------------------------------------
// Styles (Optimized for Readability & Large Touch Targets)
// ---------------------------------------------------------------------------
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f3f4f6" },
  scrollContent: { padding: 20, paddingBottom: 40 },
  headerTitle: { fontSize: 32, fontWeight: "bold", color: "#111827", textAlign: "center", marginTop: 10 },
  subHeader: { fontSize: 16, color: "#6b7280", textAlign: "center", marginBottom: 30 },
  
  card: { backgroundColor: "#ffffff", padding: 20, borderRadius: 16, marginBottom: 16, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  label: { fontSize: 16, fontWeight: "600", color: "#374151", marginBottom: 16 },
  
  emojiContainer: { flexDirection: "row", justifyContent: "space-between" },
  emojiBtn: { padding: 10, borderRadius: 50, backgroundColor: "#f9fafb", borderWidth: 2, borderColor: "transparent" },
  emojiBtnSelected: { backgroundColor: "#eff6ff", borderColor: "#3b82f6" },
  emojiText: { fontSize: 32 },

  stepperContainer: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20 },
  stepperBtn: { width: 50, height: 50, backgroundColor: "#f3f4f6", borderRadius: 25, alignItems: "center", justifyContent: "center" },
  stepperSymbol: { fontSize: 24, fontWeight: "600", color: "#4b5563" },
  stepperValue: { fontSize: 28, fontWeight: "bold", color: "#111827", width: 80, textAlign: "center" },

  textInput: { backgroundColor: "#f9fafb", borderWidth: 1, borderColor: "#e5e7eb", borderRadius: 12, padding: 16, fontSize: 16, color: "#111827", minHeight: 100, textAlignVertical: "top" },
  
  submitButton: { backgroundColor: "#4f46e5", paddingVertical: 18, borderRadius: 12, alignItems: "center", marginTop: 10 },
  submitButtonDisabled: { backgroundColor: "#818cf8" },
  submitButtonText: { color: "#ffffff", fontSize: 18, fontWeight: "bold" }
});