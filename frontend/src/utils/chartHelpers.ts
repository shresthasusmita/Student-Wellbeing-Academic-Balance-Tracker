import { WeeklyLog } from "../types/WeeklyLog";

function getDayLabel(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-GB", {
    weekday: "short",
  });
}

function createChartData(logs: WeeklyLog[], key: keyof WeeklyLog) {
  if (!logs || logs.length === 0) {
    return {
      labels: ["No Data"],
      datasets: [{ data: [0] }],
    };
  }

  return {
    labels: logs.map((log) => getDayLabel(log.log_date)),
    datasets: [
      {
        data: logs.map((log) => Number(log[key])),
      },
    ],
  };
}

export const getStressChartData = (logs: WeeklyLog[]) =>
  createChartData(logs, "stress");

export const getMoodChartData = (logs: WeeklyLog[]) =>
  createChartData(logs, "mood");

export const getSleepChartData = (logs: WeeklyLog[]) =>
  createChartData(logs, "sleep_hours");

export const getStudyChartData = (logs: WeeklyLog[]) =>
  createChartData(logs, "study_hours");