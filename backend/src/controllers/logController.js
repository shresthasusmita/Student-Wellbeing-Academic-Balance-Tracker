const logModel = require("../models/logModel");

async function createDailyLog(req, res) {
  try {
    const userId = req.user.id; // Extracted safely from authenticated JWT payload
    const { mood, stress, sleep_hours, study_hours, notes, log_date } = req.body;

    // -------------------------------------------------------------------------
    // Dual-Layer Input Validation (Enforcing AT2 Level 6 Quality Specification)
    // -------------------------------------------------------------------------
    
    // 1. Mandatory Fields Presence Check
    if (!mood || !stress || sleep_hours === undefined || study_hours === undefined || !log_date) {
      return res.status(400).json({
        success: false,
        message: "Missing mandatory logging parameters. Please complete all fields."
      });
    }

    // 2. Mood Validation: Enforce strict integer data type and 1-5 domain constraint
    if (!Number.isInteger(mood) || mood < 1 || mood > 5) {
      return res.status(400).json({
        success: false,
        message: "Validation Error: Mood must be an integer between 1 (Very Bad) and 5 (Excellent)."
      });
    }

    // 3. Stress Validation: Enforce strict integer data type and 1-5 domain constraint
    if (!Number.isInteger(stress) || stress < 1 || stress > 5) {
      return res.status(400).json({
        success: false,
        message: "Validation Error: Stress must be an integer between 1 (Very Low) and 5 (Very High)."
      });
    }

    // 4. Sleep Hours Validation: Enforce numeric scale constraint (float/int) between 0.0 and 24.0
    if (typeof sleep_hours !== "number" || sleep_hours < 0 || sleep_hours > 24) {
      return res.status(400).json({
        success: false,
        message: "Validation Error: Sleep hours must be a valid numeric duration between 0.0 and 24.0."
      });
    }

    // 5. Study Hours Validation: Enforce numeric scale constraint (float/int) between 0.0 and 24.0
    if (typeof study_hours !== "number" || study_hours < 0 || study_hours > 24) {
      return res.status(400).json({
        success: false,
        message: "Validation Error: Study hours must be a valid numeric duration between 0.0 and 24.0."
      });
    }

    // 6. Notes Field (Optional): Structural length bounds checking
    if (notes && (typeof notes !== "string" || notes.length > 500)) {
      return res.status(400).json({
        success: false,
        message: "Validation Error: Contextual notes must be a text block under 500 characters."
      });
    }

    // -------------------------------------------------------------------------
    // Execution Layer & Relational Database Transmission
    // -------------------------------------------------------------------------
    const insertId = await logModel.createLog(
      userId,
      mood,
      stress,
      sleep_hours,
      study_hours,
      notes,
      log_date
    );

    return res.status(201).json({
      success: true,
      message: "Daily wellbeing metric entry successfully captured.",
      logId: insertId
    });

  } catch (error) {
    // Catch-all duplicate verification: Intercepts relational database errors gracefully
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,
        message: "Daily log already exists for today. Duplicate entries are blocked."
      });
    }

    // Unhandled exception routing
    return res.status(500).json({
      success: false,
      message: "An internal server error occurred while writing parameters to disk.",
      error: error.message
    });
  }
}

async function getWeeklySummary(req, res) {
  try {
    const userId = req.user.id;
    const records = await logModel.getWeeklyLogs(userId);
    
    return res.status(200).json({
      success: true,
      count: records.length,
      logs: records
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to compile the historical time-series summary profiles.",
      error: error.message
    });
  }
}

module.exports = {
  createDailyLog,
  getWeeklySummary
};