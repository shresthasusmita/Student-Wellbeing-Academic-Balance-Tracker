const express = require("express");
const router = express.Router();

// Destructure the controllers cleanly once
const { register, login } = require("../controllers/authControllers");

// Assign the routes to their respective handlers
router.post("/register", register);
router.post("/login", login);

module.exports = router;