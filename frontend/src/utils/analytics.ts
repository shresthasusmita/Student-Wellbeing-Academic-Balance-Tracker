import { DailyLogPayload } from "../services/logService";

// Extend the existing payload to include the ID from the database
export interface WeeklyLog extends DailyLogPayload {
  id: number;
}

export interface WeeklyInsights {
  averageStress: number;
  averageSleep: number;
  averageStudy: number;
  stressMessage: string;
  sleepMessage: string;
  studyMessage: string;
}

/**
 * Calculates a safe, 1-decimal-place average from an array of numbers.
 */
function average(values: number[]): number {
  if (values.length === 0) return 0;
  return Number((values.reduce((a, b) => a + b, 0) / values.length).toFixed(1));
}

/**
 * Generates numerical averages and supportive, non-clinical feedback strings.
 */
export function generateInsights(logs: WeeklyLog[]): WeeklyInsights {
  // 1. Calculate Averages
  const averageStress = average(logs.map(log => log.stress));
  const averageSleep = average(logs.map(log => log.sleep_hours));
  const averageStudy = average(logs.map(log => log.study_hours));

  // 2. Generate Supportive Feedback (AT2 Compliant)
  let stressMessage = "";
  if (averageStress >= 4) {
    stressMessage = `Your average stress this week was ${averageStress}/5. Consider reducing workload pressure and scheduling recovery time.`;
  } else if (averageStress >= 3) {
    stressMessage = `Your average stress this week was ${averageStress}/5. Stress levels appear moderate.`;
  } else if (averageStress > 0) {
    stressMessage = `Your average stress this week was ${averageStress}/5. Stress levels appear well managed.`;
  } else {
    stressMessage = "Log your daily metrics to generate stress insights.";
  }

  let sleepMessage = "";
  if (averageSleep > 0 && averageSleep < 6) {
    sleepMessage = `Average sleep was ${averageSleep} hours. Improving sleep consistency may support wellbeing and academic performance.`;
  } else if (averageSleep > 0) {
    sleepMessage = `Average sleep was ${averageSleep} hours. Sleep levels appear healthy.`;
  } else {
    sleepMessage = "Log your daily metrics to generate sleep insights.";
  }

  let studyMessage = "";
  if (averageStudy > 0 && averageStudy < 2) {
    studyMessage = `Average study time was ${averageStudy} hours per day.`;
  } else if (averageStudy > 0) {
    studyMessage = `Average study time was ${averageStudy} hours per day.`;
  } else {
    studyMessage = "Log your daily metrics to generate study insights.";
  }

  return {
    averageStress,
    averageSleep,
    averageStudy,
    stressMessage,
    sleepMessage,
    studyMessage
  };
}