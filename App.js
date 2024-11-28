const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const User = require("./Models/User");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
require("dotenv").config();
// MongoDB connection
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

// Register
app.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).send("Username already exists");
    }

    const user = new User({ username, password });
    const data = await user.save();
    res.status(201).json({ success: false, message: "Success", data: data });
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

// Login
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if the user exists and the password matches
    const user = await User.findOne({ username, password });
    if (!user) {
      return res.status(401).send("Invalid username or password");
    }

    res.send("Login successful!");
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

// Start server
const PORT = 3000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
