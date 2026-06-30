const express = require("express");
const router = express.Router();
const { createDailyLog, getWeeklySummary } = require("../controllers/logController");
const authenticateToken = require("../middleware/authMiddleware");

// Apply the token authentication middleware globally across all logging endpoints
router.use(authenticateToken);

// POST /api/logs - Submits a low-friction structured check-in form
router.post("/", createDailyLog);

// GET /api/logs/weekly - Pulls rolling metrics for visualization trends
router.get("/weekly", getWeeklySummary);

module.exports = router;