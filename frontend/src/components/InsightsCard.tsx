import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { WeeklyInsights } from "../utils/analytics";

interface Props {
  insights: WeeklyInsights;
}

export default function InsightsCard({ insights }: Props) {
  // Neo-Brutalist Block Rating Component for an improved UI feel
  const renderBlockRating = (rating: number) => {
    const maxStars = 5;
    const blocks = [];
    
    for (let i = 1; i <= maxStars; i++) {
      blocks.push(
        <View
          key={i}
          style={[
            styles.ratingBlock,
            i <= Math.round(rating) ? styles.ratingBlockFilled : styles.ratingBlockEmpty,
          ]}
        />
      );
    }
    return <View style={styles.ratingContainer}>{blocks}</View>;
  };

  return (
    <View style={styles.gridContainer}>
      {/* Row 1: Header Title */}
      <View style={styles.row}>
        <View style={[styles.leftColumn, { backgroundColor: "#54D2F2" }]} />
        <View style={styles.rightColumn}>
          <Text style={styles.heading}>Weekly Summary</Text>
        </View>
      </View>

      {/* Row 2: Average Stress (With Visual Rating Blocks) */}
      <View style={styles.row}>
        <View style={[styles.leftColumn, { backgroundColor: "#FF5A5A" }]} />
        <View style={styles.rightColumn}>
          <View style={styles.ratingHeaderRow}>
            <Text style={styles.average}>Average Stress</Text>
            {renderBlockRating(insights.averageStress ?? 0)}
          </View>
          <Text style={styles.message}>{insights.stressMessage}</Text>
        </View>
      </View>

      {/* Row 3: Average Sleep */}
      <View style={styles.row}>
        <View style={[styles.leftColumn, { backgroundColor: "#FFDE4D" }]} />
        <View style={styles.rightColumn}>
          <Text style={styles.average}>
            Average Sleep: {insights.averageSleep} HRS
          </Text>
          <Text style={styles.message}>{insights.sleepMessage}</Text>
        </View>
      </View>

      {/* Row 4: Average Study (Terminal row - no outer bottom border line) */}
      <View style={styles.lastRow}>
        <View style={[styles.leftColumn, { backgroundColor: "#A3E635" }]} />
        <View style={styles.rightColumn}>
          <Text style={styles.average}>
            Average Study: {insights.averageStudy} HRS
          </Text>
          <Text style={styles.message}>{insights.studyMessage}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  gridContainer: {
    marginBottom: 24,
    marginTop: 8,
    // Explicitly contains no outer borders, matching the style of image_92499b.png
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 3,
    borderColor: "#000000",
  },
  lastRow: {
    flexDirection: "row",
    // No bottom border here prevents an outer bounding box line closure
  },
  leftColumn: {
    width: 36,
    borderRightWidth: 3,
    borderColor: "#000000",
  },
  rightColumn: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  heading: {
    fontSize: 22,
    fontWeight: "900",
    color: "#000000",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  ratingHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 4,
  },
  average: {
    fontSize: 15,
    fontWeight: "900",
    color: "#000000",
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  message: {
    marginTop: 4,
    color: "#000000",
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 20,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingBlock: {
    width: 14,
    height: 14,
    borderWidth: 2,
    borderColor: "#000000",
    marginRight: 4,
  },
  ratingBlockFilled: {
    backgroundColor: "#FFDE4D", // Signature vibrant yellow block fill from the reference mockup
  },
  ratingBlockEmpty: {
    backgroundColor: "#FFFFFF",
  },
});