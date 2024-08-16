const jwt = require("jsonwebtoken");
const winston = require("winston");
const {
  createUser,
  findUserByEmail,
  comparePassword,
} = require("../services/userService");

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
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const user = await createUser({ username, email, password });

    logger.info(`User created successfully: ${user._id}`);

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({
      message: "Registration successful",
      token,
      user: {
        username: user.username,
        email: user.email,
      },
    });
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

  if (!email || !password) {
    return res.status(400).json({
      message: "Email or Password not present",
    });
  }

  try {
    const user = await findUserByEmail(email);
    if (!user) {
      logger.error(`Login failed for email: ${email} - User not found`);
      return res.status(400).json({
        message: "Login not successful",
        error: "User not found",
      });
    }

    const isMatch = await comparePassword(password, user.password);
    console.log(`Password valid: ${isMatch}`);

    if (isMatch) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      res.cookie("token", token, { httpOnly: true });
      logger.info(`User logged in successfully: ${user._id}`);

      // Return user details along with the token
      return res.status(200).json({
        message: "Login successful",
        token,
        user: {
          username: user.username,
          email: user.email,
        },
      });
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
