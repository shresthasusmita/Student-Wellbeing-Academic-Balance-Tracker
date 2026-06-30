import React from "react";
import { View, Text, Dimensions, StyleSheet } from "react-native";
import { BarChart } from "react-native-chart-kit";
import { WeeklyLog } from "../types/WeeklyLog";
import {
  getSleepChartData,
  getStudyChartData,
} from "../utils/chartHelpers";

// Screen width padding math: 20px screen margins * 2 + 16px internal card margins * 2 = 72px total offset
const chartWidth = Dimensions.get("window").width - 72;

// Shared Neo-Brutalist structural chart tokens matching the reference image layout profile
const baseChartConfig = {
  backgroundGradientFrom: "#FFFFFF",
  backgroundGradientTo: "#FFFFFF",
  decimalPlaces: 1,
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Stark solid grid markings
  labelColor: () => "#000000", 
  propsForLabels: {
    fontWeight: "900", // Thick, heavy axis layout text properties
    fontSize: 11,
  },
  barPercentage: 0.6,
  fillShadowGradientOpacity: 1, // Suppresses modern transparent gradient masks completely
};

const sleepChartConfig = {
  ...baseChartConfig,
  fillShadowGradientFrom: "#54D2F2", // Signature vibrant accent blue from bea1ac164728311.6423177996aee.webp
  fillShadowGradientTo: "#54D2F2",
};

const studyChartConfig = {
  ...baseChartConfig,
  fillShadowGradientFrom: "#FFDE4D", // High-contrast signature container yellow
  fillShadowGradientTo: "#FFDE4D",
};

interface Props {
  logs: WeeklyLog[];
}

export default function SleepStudyChart({ logs }: Props) {
  return (
    <View style={styles.wrapper}>
      {/* Sleep Performance Metrics Card */}
      <View style={styles.card}>
        <Text style={styles.title}>Weekly Sleep Hours</Text>
        <BarChart
          data={getSleepChartData(logs)}
          width={chartWidth}
          height={190}
          fromZero
          chartConfig={sleepChartConfig}
          withInnerLines={true}
          style={styles.chartCanvas}
        />
      </View>

      {/* Academic Engagement Metrics Card */}
      <View style={styles.card}>
        <Text style={styles.title}>Weekly Study Hours</Text>
        <BarChart
          data={getStudyChartData(logs)}
          width={chartWidth}
          height={190}
          fromZero
          chartConfig={studyChartConfig}
          withInnerLines={true}
          style={styles.chartCanvas}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderWidth: 3,
    borderColor: "#000000",
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    // True Neo-Brutalist flat hard offset shadows from the primary image reference
    shadowColor: "#000000",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  title: {
    fontSize: 18,
    fontWeight: "900",
    color: "#000000",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  chartCanvas: {
    alignSelf: "center",
    marginTop: 4,
    borderRadius: 0, // Enforces clean rigid corners on inner graphics packages
  },
});