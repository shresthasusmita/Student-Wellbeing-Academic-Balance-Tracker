const express = require("express");
const router = express.Router();
const { register, login, getProfile } = require("../controllers/authControllers");
const authenticateToken = require("../middleware/authMiddleware");

// Public Routes
router.post("/register", register);
router.post("/login", login);

// Protected Route (Requires valid JWT)
router.get("/profile", authenticateToken, getProfile);

module.exports = router;