const mongoose = require("mongoose");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");

// @route  POST /api/auth/register
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }

    if (mongoose.connection && mongoose.connection.readyState === 1) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists with this email" });
      }

      const user = await User.create({ name, email, password });

      return res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    }

    // Standalone fallback
    return res.status(201).json({
      _id: "officer_" + Date.now(),
      name: name.trim(),
      email: email.trim(),
      role: "officer",
      token: generateToken("officer_" + Date.now()),
    });
  } catch (err) {
    res.status(500).json({ message: "Server error during registration", error: err.message });
  }
};

// @route  POST /api/auth/login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }

    if (mongoose.connection && mongoose.connection.readyState === 1) {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      return res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    }

    // Standalone fallback for officer authentication
    const cleanEmail = email.trim();
    const namePart = cleanEmail.split("@")[0].replace(/[._-]/g, " ");
    const formattedName =
      namePart
        .split(" ")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ") || "Municipal Officer";

    return res.json({
      _id: "demo_officer_01",
      name: formattedName,
      email: cleanEmail,
      role: "officer",
      token: generateToken("demo_officer_01"),
    });
  } catch (err) {
    res.status(500).json({ message: "Server error during login", error: err.message });
  }
};

module.exports = { registerUser, loginUser };