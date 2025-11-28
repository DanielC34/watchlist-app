import jwt from "jsonwebtoken";
import winston from "winston";
import { Response } from "express";
import {
  comparePassword,
  createUser,
  findUserByEmail,
} from "../services/userService";
import { AuthRequest } from "../types";

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "error.log" }),
  ],
});

const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

export const register = async (req: AuthRequest, res: Response) => {
  const {
    username,
    email,
    password,
  }: { username?: string; email?: string; password?: string } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  try {
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const user = await createUser({ username, email, password });

    logger.info(`User created successfully: ${user._id.toString()}`);

    const token = jwt.sign({ id: user._id.toString() }, jwtSecret, {
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
    logger.error(`Registration error: ${(err as Error).message}`);
    res.status(400).json({
      error: "An error occurred during registration. Please try again.",
    });
  }
};

export const login = async (req: AuthRequest, res: Response) => {
  const { email, password }: { email?: string; password?: string } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email or Password not present",
    });
  }

  try {
    const user = await findUserByEmail(email);
    if (!user) {
      logger.error("Login failed - User not found", {
        email: email.replace(/[\r\n]/g, ""),
      });
      return res.status(400).json({
        message: "Login not successful",
        error: "User not found",
      });
    }

    const isMatch = await comparePassword(password, user.password);

    if (!isMatch) {
      logger.error("Login failed - Invalid password", {
        email: email.replace(/[\r\n]/g, ""),
      });
      return res.status(400).json({
        message: "Login not successful",
        error: "Incorrect password",
      });
    }

    const token = jwt.sign({ id: user._id.toString() }, jwtSecret, {
      expiresIn: "1h",
    });

    res.cookie("token", token, { httpOnly: true });
    logger.info(`User logged in successfully: ${user._id.toString()}`);

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    logger.error("Login error occurred", {
      email: email.replace(/[\r\n]/g, ""),
      error: (error as Error).message.replace(/[\r\n]/g, ""),
      stack: (error as Error).stack,
    });
    return res.status(500).json({
      message: "An error occurred",
      error: (error as Error).message,
    });
  }
};

export const logout = (req: AuthRequest, res: Response) => {
  res.cookie("token", "", {
    expires: new Date(0),
    httpOnly: true,
    secure: true,
  });

  logger.info(
    `User ${req.user ? req.user.id : "unknown"} logged out at ${new Date().toISOString()}`
  );

  res.status(200).json({ message: "Logged out successfully" });
};
