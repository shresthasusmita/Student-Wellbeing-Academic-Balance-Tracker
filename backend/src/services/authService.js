const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userModel = require("../models/userModel");

async function registerUser(name, email, password) {

  const existingUser =
    await userModel.findUserByEmail(email);

  if (existingUser) {
    throw new Error("Email already exists");
  }

  const hashedPassword =
    await bcrypt.hash(password, 10);

  const userId =
    await userModel.createUser(
      name,
      email,
      hashedPassword
    );

  return userId;
}

async function loginUser(email, password) {

  const user =
    await userModel.findUserByEmail(email);

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const match =
    await bcrypt.compare(
      password,
      user.password_hash
    );

  if (!match) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d"
    }
  );

  return token;
}

module.exports = {
  registerUser,
  loginUser
};