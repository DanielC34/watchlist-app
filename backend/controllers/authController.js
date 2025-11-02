const jwt = require("jsonwebtoken");

// Configure the logger
const getLogger = () => {
  const winston = require("winston");
  return winston.createLogger({
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
};

// User registration
exports.register = async (req, res) => {
  const { createUser, findUserByEmail } = require("../services/userService");
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

    getLogger().info(`User created successfully: ${user._id}`);

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
    getLogger().error(`Registration error: ${err.message}`);
    res.status(400).json({
      error: "An error occurred during registration. Please try again.",
    });
  }
};

// User login
exports.login = async (req, res) => {
  const { findUserByEmail, comparePassword } = require("../services/userService");
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email or Password not present",
    });
  }

  try {
    const user = await findUserByEmail(email);
    if (!user) {
      getLogger().error('Login failed - User not found', { email: email.replace(/[\r\n]/g, '') });
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
      getLogger().info(`User logged in successfully: ${user._id}`);

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
      getLogger().error('Login failed - Invalid password', { email: email.replace(/[\r\n]/g, '') });
      return res.status(400).json({
        message: "Login not successful",
        error: "Incorrect password",
      });
    }
  } catch (error) {
    getLogger().error('Login error occurred', {
      email: email.replace(/[\r\n]/g, ''),
      error: error.message.replace(/[\r\n]/g, ''),
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

  getLogger().info(
    `User ${req.user ? req.user.id : "unknown"} logged out at ${new Date()}`
  );

  res.status(200).json({ message: "Logged out successfully" });
};
