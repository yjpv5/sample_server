import User from '../models/User.js';
import jwt from 'jsonwebtoken';
 
export const registerUser = async (username, password) => {
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    throw new Error('Username already exists');
  }
  return User.create({ username, password });
};
 
export const loginUser = async (username, password) => {
  const user = await User.findOne({ username });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error('Invalid credentials');
  }
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '8h' });
};