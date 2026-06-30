const pool = require("../config/db");

/**
 * Persists a new daily wellbeing entry to the MySQL database
 */
async function createLog(userId, mood, stress, sleepHours, studyHours, notes, logDate) {
  const [result] = await pool.query(
    `
    INSERT INTO daily_logs 
    (user_id, mood, stress, sleep_hours, study_hours, notes, log_date) 
    VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
    [userId, mood, stress, sleepHours, studyHours, notes, logDate]
  );
  return result.insertId;
}

/**
 * Fetches the entire chronological historical log for a user
 */
async function getLogsByUser(userId) {
  const [rows] = await pool.query(
    `
    SELECT id, mood, stress, sleep_hours, study_hours, notes, log_date, created_at 
    FROM daily_logs 
    WHERE user_id = ? 
    ORDER BY log_date DESC
    `,
    [userId]
  );
  return rows;
}

/**
 * Retrieves rolling 7-day time-series aggregates to feed the frontend analytics charts
 */
async function getWeeklyLogs(userId) {
  const [rows] = await pool.query(
    `
    SELECT mood, stress, sleep_hours, study_hours, log_date 
    FROM daily_logs 
    WHERE user_id = ? 
    AND log_date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
    ORDER BY log_date ASC
    `,
    [userId]
  );
  return rows;
}

module.exports = {
  createLog,
  getLogsByUser,
  getWeeklyLogs
};