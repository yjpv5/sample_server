const User = require('../models/User.js');
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");


const registerUser = async (username, password) => {
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    const error = new Error("Username already exists");
    error.statusCode = 409;
    throw error;
  }
  return User.create({ username, password });
};

const loginUser = async (username, password) => {
  const user = await User.findOne({ username });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    const error = new Error("Invalid credentials");
    error.statusCode = 401;
    throw error;
  }
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '8h' });
};

module.exports = {
  registerUser,
  loginUser
};