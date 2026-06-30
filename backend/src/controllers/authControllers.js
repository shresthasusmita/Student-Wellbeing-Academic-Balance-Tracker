const authService =
    require("../services/authService");
const userModel = require("../models/userModel");

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

module.exports = {
  register,
  login
};