"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.login = exports.register = void 0;
/// <reference path="../types/express.d.ts" />
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const winston_1 = __importDefault(require("winston"));
const userService_1 = require("../services/userService");
const logger = winston_1.default.createLogger({
    level: "info",
    format: winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.json()),
    transports: [
        new winston_1.default.transports.Console(),
        new winston_1.default.transports.File({ filename: "error.log" }),
    ],
});
const register = async (req, res) => {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        return res.status(500).json({ error: "Server configuration error" });
    }
    const { username, email, password, } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ error: "Missing required fields" });
    }
    try {
        const existingUser = await (0, userService_1.findUserByEmail)(email);
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }
        const user = await (0, userService_1.createUser)({ username, email, password });
        logger.info(`User created successfully: ${user._id.toString()}`);
        const token = jsonwebtoken_1.default.sign({ id: user._id.toString() }, jwtSecret, {
            expiresIn: "1h",
        });
        return res.status(201).json({
            message: "Registration successful",
            token,
            user: {
                username: user.username,
                email: user.email,
            },
        });
    }
    catch (err) {
        logger.error(`Registration error: ${err.message}`);
        return res.status(400).json({
            error: "An error occurred during registration. Please try again.",
        });
    }
};
exports.register = register;
const login = async (req, res) => {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        return res.status(500).json({ error: "Server configuration error" });
    }
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({
            message: "Email or Password not present",
        });
    }
    try {
        const user = await (0, userService_1.findUserByEmail)(email);
        if (!user) {
            logger.error("Login failed - User not found", {
                email: email.replace(/[\r\n]/g, ""),
            });
            return res.status(400).json({
                message: "Login not successful",
                error: "User not found",
            });
        }
        const isMatch = await (0, userService_1.comparePassword)(password, user.password);
        if (!isMatch) {
            logger.error("Login failed - Invalid password", {
                email: email.replace(/[\r\n]/g, ""),
            });
            return res.status(400).json({
                message: "Login not successful",
                error: "Incorrect password",
            });
        }
        const token = jsonwebtoken_1.default.sign({ id: user._id.toString() }, jwtSecret, {
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
    }
    catch (error) {
        logger.error("Login error occurred", {
            email: email.replace(/[\r\n]/g, ""),
            error: error.message.replace(/[\r\n]/g, ""),
            stack: error.stack,
        });
        return res.status(500).json({
            message: "An error occurred",
            error: error.message,
        });
    }
};
exports.login = login;
const logout = (req, res) => {
    res.cookie("token", "", {
        expires: new Date(0),
        httpOnly: true,
        secure: true,
    });
    logger.info(`User ${req.user ? req.user._id : "unknown"} logged out at ${new Date().toISOString()}`);
    res.status(200).json({ message: "Logged out successfully" });
};
exports.logout = logout;
