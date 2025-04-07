const express = require("express");
const userService = require("../services/userService.js");

const router = express.Router();

router.post("/register", async (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    const error = new Error("username and password are required.");
    error.statusCode = 400;
    return next(error);
  }

  try {
    const user = await userService.registerUser(username, password);
    res.status(201).json({
      _id: user._id,
      username: user.username,
      message: "User registered successfully.",
    });
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    const error = new Error("username and password are required.");
    error.statusCode = 400;
    return next(error);
  }

  try {
    const token = await userService.loginUser(username, password);
    res.status(200).json({
      message: "Login successful.",
      token,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
