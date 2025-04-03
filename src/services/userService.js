const User=require('../models/User.js');
const jwt=require('jsonwebtoken');
const bcrypt = require("bcryptjs");

 
exports.registerUser = async (username, password) => {
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    throw new Error('Username already exists');
  }
  return User.create({ username, password });
};
 
exports.loginUser = async (username, password) => {
  const user = await User.findOne({ username });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error('Invalid credentials');
  }
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '8h' });
};