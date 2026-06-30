const authService =
    require("../services/authService");
const userModel = require("../models/userModel");
const pool = require("../config/db");

async function register(req, res) {

  try {

    const {
      name,
      email,
      password
    } = req.body;

    const userId =
      await authService.registerUser(
        name,
        email,
        password
      );

    return res.status(201).json({
      success: true,
      userId
    });

  } catch (error) {

    return res.status(400).json({
      success: false,
      message: error.message
    });

  }
}

async function login(req, res) {

  try {

    const {
      email,
      password
    } = req.body;

    const token =
      await authService.loginUser(
        email,
        password
      );

    return res.status(200).json({
      success: true,
      token
    });

  } catch (error) {

    return res.status(401).json({
      success: false,
      message: error.message
    });

  }
}
async function getProfile(req, res) {
  try {
    const userId = req.user.id; // Extracted securely from the JWT middleware

    // Query the database for the user, excluding the password hash
    const [rows] = await pool.query(
      "SELECT id, name, email, created_at FROM users WHERE id = ?",
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "User profile not found." });
    }

    return res.status(200).json({
      success: true,
      user: rows[0]
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve profile data.",
      error: error.message
    });
  }
}

module.exports = {
  register,
  login,
  getProfile
};