import React from "react";
import { View, Text, Dimensions, StyleSheet } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { WeeklyLog } from "../types/WeeklyLog";
import {
  getStressChartData,
  getMoodChartData,
} from "../utils/chartHelpers";

// Syncing chart bounds with layout rules: Viewport width minus outer screen and inner card padding
const chartWidth = Dimensions.get("window").width - 72;

// Shared Neo-Brutalist structural configuration tokens
const baseChartConfig = {
  backgroundGradientFrom: "#FFFFFF",
  backgroundGradientTo: "#FFFFFF",
  decimalPlaces: 1,
  labelColor: () => "#000000",
  propsForLabels: {
    fontWeight: "900", // Chunky axis label tracking typography
    fontSize: 11,
  },
  propsForDots: {
    r: "5",
    strokeWidth: "3",
    stroke: "#000000", // Heavy black border enclosing line data milestones
  },
  useShadowColorFromDataset: false, 
};

const stressChartConfig = {
  ...baseChartConfig,
  color: (opacity = 1) => `rgba(255, 90, 90, ${opacity})`, // Stark high-contrast red for stress trends
};

const moodChartConfig = {
  ...baseChartConfig,
  color: (opacity = 1) => `rgba(84, 210, 242, ${opacity})`, // Stark vibrant cyan for mood tracking
};

interface Props {
  logs: WeeklyLog[];
}

export default function StressMoodChart({ logs }: Props) {
  return (
    <View style={styles.wrapper}>
      {/* Stress Evaluation Panel */}
      <View style={styles.card}>
        <Text style={styles.title}>Weekly Stress Trend</Text>
        <LineChart
          data={getStressChartData(logs)}
          width={chartWidth}
          height={190}
          fromZero
          yAxisInterval={1}
          chartConfig={stressChartConfig}
          withInnerLines={true}
          style={styles.chartCanvas}
        />
      </View>

      {/* Mood Evaluation Panel */}
      <View style={styles.card}>
        <Text style={styles.title}>Weekly Mood Trend</Text>
        <LineChart
          data={getMoodChartData(logs)}
          width={chartWidth}
          height={190}
          fromZero
          yAxisInterval={1}
          chartConfig={moodChartConfig}
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
    // Crisp Neo-Brutalist flat structural drop shadow (iOS)
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
    borderRadius: 0, // Strips out library rounded canvas defaults
  },
});