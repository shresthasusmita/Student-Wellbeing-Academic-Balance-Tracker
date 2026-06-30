const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const userRoutes =
  require("./routes/userRoutes");
const logRoutes = require("./routes/logRoutes");
  
require("dotenv").config();

const authRoutes =
  require("./routes/authRoutes");

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/logs", logRoutes);
app.get("/", (req, res) => {
  res.json({
    message:
      "Student Wellbeing API Running"
  });
});

module.exports = app;