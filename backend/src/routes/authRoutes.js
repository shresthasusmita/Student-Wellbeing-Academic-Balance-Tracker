const express = require("express");
const router = express.Router();

// Destructure the controllers cleanly once
const { register, login, getProfile} = require("../controllers/authControllers");
const authenticateToken = require("../middleware/authMiddleware");

// Assign the routes to their respective handlers
router.post("/register", register);
router.post("/login", login);
// Protected Route (Requires valid JWT)
router.get("/profile", authenticateToken, getProfile);

module.exports = router;