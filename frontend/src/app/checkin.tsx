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
          <Text style={styles.label}>Mood Status</Text>
          <View style={styles.emojiContainer}>
            {moodEmojis.map((emoji, index) => {
              const value = index + 1;
              const isSelected = mood === value;
              return (
                <Pressable 
                  key={value} 
                  onPress={() => setMood(value)}
                  style={({ pressed }) => [
                    styles.emojiBtn, 
                    isSelected && styles.emojiBtnSelected,
                    pressed && styles.pressedState
                  ]}
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
            <Pressable 
              style={({ pressed }) => [styles.stepperBtn, pressed && styles.pressedState]} 
              onPress={() => adjustValue(setStress, stress, -1, 1, 5)}
            >
              <Text style={styles.stepperSymbol}>-</Text>
            </Pressable>
            <Text style={styles.stepperValue}>{stress}</Text>
            <Pressable 
              style={({ pressed }) => [styles.stepperBtn, pressed && styles.pressedState]} 
              onPress={() => adjustValue(setStress, stress, 1, 1, 5)}
            >
              <Text style={styles.stepperSymbol}>+</Text>
            </Pressable>
          </View>
        </View>

        {/* 3. SLEEP - Float Stepper (0.5 increments) */}
        <View style={styles.card}>
          <Text style={styles.label}>Sleep Duration</Text>
          <View style={styles.stepperContainer}>
            <Pressable 
              style={({ pressed }) => [styles.stepperBtn, pressed && styles.pressedState]} 
              onPress={() => adjustValue(setSleepHours, sleepHours, -0.5, 0, 24)}
            >
              <Text style={styles.stepperSymbol}>-</Text>
            </Pressable>
            <Text style={styles.stepperValue}>{sleepHours.toFixed(1)} <Text style={styles.stepperUnit}>HRS</Text></Text>
            <Pressable 
              style={({ pressed }) => [styles.stepperBtn, pressed && styles.pressedState]} 
              onPress={() => adjustValue(setSleepHours, sleepHours, 0.5, 0, 24)}
            >
              <Text style={styles.stepperSymbol}>+</Text>
            </Pressable>
          </View>
        </View>

        {/* 4. STUDY - Float Stepper (0.5 increments) */}
        <View style={styles.card}>
          <Text style={styles.label}>Study Duration</Text>
          <View style={styles.stepperContainer}>
            <Pressable 
              style={({ pressed }) => [styles.stepperBtn, pressed && styles.pressedState]} 
              onPress={() => adjustValue(setStudyHours, studyHours, -0.5, 0, 24)}
            >
              <Text style={styles.stepperSymbol}>-</Text>
            </Pressable>
            <Text style={styles.stepperValue}>{studyHours.toFixed(1)} <Text style={styles.stepperUnit}>HRS</Text></Text>
            <Pressable 
              style={({ pressed }) => [styles.stepperBtn, pressed && styles.pressedState]} 
              onPress={() => adjustValue(setStudyHours, studyHours, 0.5, 0, 24)}
            >
              <Text style={styles.stepperSymbol}>+</Text>
            </Pressable>
          </View>
        </View>

        {/* 5. NOTES - Optional Text Input */}
        <View style={styles.card}>
          <Text style={styles.label}>Notes (Optional)</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Any context for today?"
            placeholderTextColor="#7A7A7A"
            value={notes}
            onChangeText={setNotes}
            maxLength={500}
            multiline
            numberOfLines={3}
          />
        </View>

        {/* SUBMIT BUTTON */}
        <Pressable 
          style={({ pressed }) => [
            styles.submitButton, 
            isSubmitting && styles.submitButtonDisabled,
            pressed && !isSubmitting && styles.pressedState
          ]} 
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#000000" />
          ) : (
            <Text style={styles.submitButtonText}>Save Daily Log</Text>
          )}
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#FFF9EE" 
  },
  scrollContent: { 
    padding: 24, 
    paddingBottom: 40 
  },
  headerTitle: { 
    fontSize: 32, 
    fontWeight: "900", 
    color: "#000000", 
    textAlign: "center", 
    marginTop: 10,
    textTransform: "uppercase",
    letterSpacing: 0.5
  },
  subHeader: { 
    fontSize: 16, 
    color: "#000000", 
    fontWeight: "700",
    textAlign: "center", 
    marginBottom: 28,
    marginTop: 4
  },
  card: { 
    backgroundColor: "#FFFFFF", 
    padding: 20, 
    borderRadius: 16, 
    marginBottom: 20, 
    borderWidth: 3,
    borderColor: "#000000",
    // Thick flat structural drop shadow (iOS)
    shadowColor: "#000000", 
    shadowOffset: { width: 4, height: 4 }, 
    shadowOpacity: 1, 
    shadowRadius: 0,
  },
  label: { 
    fontSize: 14, 
    fontWeight: "900", 
    color: "#000000", 
    marginBottom: 16,
    textTransform: "uppercase",
    letterSpacing: 0.5
  },
  emojiContainer: { 
    flexDirection: "row", 
    justifyContent: "space-between" 
  },
  emojiBtn: { 
    width: 48,
    height: 48,
    borderRadius: 24, 
    backgroundColor: "#FFFFFF", 
    borderWidth: 2, 
    borderColor: "#000000",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000000",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  emojiBtnSelected: { 
    backgroundColor: "#FFDE4D", // Accent high-visibility yellow select fill
    shadowOffset: { width: 0, height: 0 }, // Flat offset mimicking active downstate
  },
  emojiText: { 
    fontSize: 26 
  },
  stepperContainer: { 
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: "space-between" 
  },
  stepperBtn: { 
    width: 46, 
    height: 46, 
    backgroundColor: "#54D2F2", // Accent high-contrast cyan for active buttons
    borderRadius: 8, 
    borderWidth: 2,
    borderColor: "#000000",
    alignItems: "center", 
    justifyContent: "center",
    shadowColor: "#000000",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  stepperSymbol: { 
    fontSize: 22, 
    fontWeight: "900", 
    color: "#000000" 
  },
  stepperValue: { 
    fontSize: 24, 
    fontWeight: "900", 
    color: "#000000", 
    textAlign: "center" 
  },
  stepperUnit: {
    fontSize: 14,
    fontWeight: "800",
    color: "#000000",
  },
  textInput: { 
    backgroundColor: "#FFFFFF", 
    borderWidth: 2, 
    borderColor: "#000000", 
    borderRadius: 12, 
    padding: 14, 
    fontSize: 16, 
    color: "#000000", 
    fontWeight: "600",
    minHeight: 100, 
    textAlignVertical: "top" 
  },
  submitButton: { 
    backgroundColor: "#FFDE4D", // Signature yellow call-to-action block color
    paddingVertical: 18, 
    borderRadius: 12, 
    alignItems: "center", 
    marginTop: 10,
    borderWidth: 3,
    borderColor: "#000000",
    shadowColor: "#000000",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  submitButtonDisabled: { 
    backgroundColor: "#A3A3A3",
    shadowOffset: { width: 0, height: 0 }
  },
  submitButtonText: { 
    color: "#000000", 
    fontSize: 18, 
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 0.5
  },
  pressedState: {
    transform: [{ translateX: 2 }, { translateY: 2 }],
    shadowOffset: { width: 0, height: 0 },
  }
});