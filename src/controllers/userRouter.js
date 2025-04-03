import express from 'express';
import * as userService from '../services/userService.js';
 
const router = express.Router();

router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "username and password are required." });
  }

  try {
    const user = await userService.registerUser(username, password);
    res.status(201).json({
      _id: user._id,
      username: user.username,
      message: "User registered successfully."
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
 

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "username and password are required." });
  }

  try {
    const token = await userService.loginUser(username, password);
    res.status(200).json({
        message: "Login successful.",
        token,
    });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});
 
export default router;