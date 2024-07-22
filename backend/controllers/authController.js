const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const winston = require("winston");
const joi = require("joi");

// Configure the logger
const logger = winston.createLogger({
  level: "error",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "error.log" }),
  ],
});

//User registration
exports.register = async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
      algorithm: "RS256",
    });
    res.status(201).json({ token });
  } catch (err) {
    logger.error(`Registration error: ${err.message}`);
    res.status(400).json({
      error: "An error occurred during registration. Please try again.",
    });
  }
};

//User login

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const schema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(6).required(),
  });
  try {
    const validatedInput = await schema.validateAsync({ email, password });
    const user = await User.findOne({ email: validatedInput.email });
    if (
      !user ||
      !(await bcrypt.compare(validatedInput.password, user.password))
    ) {
      return res.status(400).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.cookie("token", token, { httpOnly: true }); // Store token in HttpOnly cookie
    res.end();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// User logout
exports.logout = (req, res) => {
  // Invalidate the token by setting it to an empty string and setting a short expiration time
  res.cookie("token", "", { expires: new Date(0) });
  res.status(200).json({ message: "Logged out successfully" });
};
