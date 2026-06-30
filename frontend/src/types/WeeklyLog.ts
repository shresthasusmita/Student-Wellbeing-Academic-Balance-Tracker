export interface WeeklyLog {
  id: number;
  mood: number;
  stress: number;
  sleep_hours: number;
  study_hours: number;
  notes?: string;
  log_date: string;
}