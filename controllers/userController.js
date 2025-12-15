const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

// Generate JWT
const generateToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, {
    expiresIn: "3d",
  });
};

// @desc    Register new user
// @route   POST /api/users/signup
// @access  Public
const signupUser = async (req, res) => {
  const { name, email, password, phone_number, gender, date_of_birth, membership_status } = req.body;

  try {
    // Signup user (User model handles validation)
    const user = await User.signup(name, email, password, phone_number, gender, date_of_birth, membership_status);

    // create a token
    const token = generateToken(user._id);

    // Return full user info except password
    const { password: _, ...userData } = user.toObject();

    res.status(201).json({ user: userData, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);

    // create a token
    const token = generateToken(user._id);

    // Return full user info except password
    const { password: _, ...userData } = user.toObject();

    res.status(200).json({ user: userData, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// @desc    Get user data
// @route   GET /api/users/me
// @access  Private
const getMe = async (req, res) => {
  try {
    // Return full user info except password
    const { password: _, ...userData } = req.user.toObject();
    res.status(200).json(userData);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  signupUser,
  loginUser,
  getMe,
};