"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const extractToken = (req) => {
    const authHeader = req.header("Authorization") ?? req.headers.authorization ?? null;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return null;
    }
    return authHeader.split(" ")[1];
};
const verifyToken = async (token) => {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        throw new Error("JWT_SECRET is not defined");
    }
    const decoded = jsonwebtoken_1.default.verify(token, jwtSecret);
    return User_1.default.findById(decoded.id).select("-password");
};
const auth = async (req, res, next) => {
    try {
        const token = extractToken(req);
        if (!token) {
            return res.status(401).json({ error: "No token, authorization denied" });
        }
        const user = await verifyToken(token);
        if (!user) {
            return res.status(401).json({ error: "User not found" });
        }
        req.user = user;
        return next();
    }
    catch {
        return res.status(401).json({ error: "Token is not valid" });
    }
};
const protect = async (req, res, next) => {
    try {
        const token = extractToken(req);
        if (!token) {
            return res.status(401).json({ error: "Not authorized, no token" });
        }
        const user = await verifyToken(token);
        if (!user) {
            return res.status(401).json({ error: "User not found" });
        }
        req.user = user;
        return next();
    }
    catch {
        return res.status(401).json({ error: "Token is not valid" });
    }
};
exports.protect = protect;
exports.default = auth;
