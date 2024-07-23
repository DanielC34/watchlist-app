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

// User registration
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
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    // Log the successful creation of the user and hashed password
    logger.info(`User created successfully: ${user._id}`);
    console.log(`Hashed password: ${hashedPassword}`);

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(201).json({ token });
  } catch (err) {
    logger.error(`Registration error: ${err.message}`);
    res.status(400).json({
      error: "An error occurred during registration. Please try again.",
    });
  }
};

// User login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  // Check if email and password are provided
  if (!email || !password) {
    return res.status(400).json({
      message: "Email or Password not present",
    });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      logger.error(`Login failed for email: ${email} - User not found`);
      return res.status(400).json({
        message: "Login not successful",
        error: "User not found",
      });
    }

    // Log the stored password hash
    console.log(`Stored password hash: ${user.password}`);

    // Comparing given password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    console.log(`Password valid: ${isMatch}`);

    if (isMatch) {
      // Generate a JWT token
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      res.cookie("token", token, { httpOnly: true }); // Store token in HttpOnly cookie

      // Log the successful login of the user
      logger.info(`User logged in successfully: ${user._id}`);

      // Send a success response with a confirmation message
      return res.status(200).json({ message: "Login successful", token });
    } else {
      logger.error(`Login failed for email: ${email} - Invalid password`);
      return res.status(400).json({
        message: "Login not successful",
        error: "Incorrect password",
      });
    }
  } catch (error) {
    logger.error(`Login error for email: ${email} - ${error.message}`, {
      stack: error.stack,
    });
    return res.status(500).json({
      message: "An error occurred",
      error: error.message,
    });
  }
};

// User logout
exports.logout = (req, res) => {
  res.cookie("token", "", {
    expires: new Date(0),
    httpOnly: true,
    secure: true,
  });

  logger.info(
    `User ${req.user ? req.user.id : "unknown"} logged out at ${new Date()}`
  );

  res.status(200).json({ message: "Logged out successfully" });
};
