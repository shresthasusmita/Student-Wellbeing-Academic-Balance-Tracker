import { WeeklyLog } from "../types/WeeklyLog";

function getDayLabel(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-GB", {
    weekday: "short",
  });
}

function createChartData(logs: WeeklyLog[], key: keyof WeeklyLog) {
  // Guard 1: Direct structural protection against empty datasets or slow network boots
  if (!logs || logs.length === 0) {
    return {
      labels: [" "],
      datasets: [
        {
          data: [0],
        },
      ],
    };
  }

  const labels = logs.map((log) => getDayLabel(log.log_date));

  // Guard 2: Enforce strict scalar evaluations on floating point indices to drop NaN/Infinite values
  const data = logs.map((log) => {
    const value = Number(log[key]);
    return Number.isFinite(value) ? value : 0;
  });

  return {
    labels,
    datasets: [
      {
        data,
      },
    ],
  };
}

export const getStressChartData = (logs: WeeklyLog[]) => createChartData(logs, "stress");
export const getMoodChartData = (logs: WeeklyLog[]) => createChartData(logs, "mood");
export const getSleepChartData = (logs: WeeklyLog[]) => createChartData(logs, "sleep_hours");
export const getStudyChartData = (logs: WeeklyLog[]) => createChartData(logs, "study_hours");