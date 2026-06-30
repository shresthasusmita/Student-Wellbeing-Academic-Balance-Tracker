import { useMemo } from "react";
import { WeeklyLog } from "../types/WeeklyLog";
import { generateInsights } from "../utils/analytics";

export function useAnalytics(logs: WeeklyLog[]) {
  return useMemo(() => generateInsights(logs), [logs]);
}