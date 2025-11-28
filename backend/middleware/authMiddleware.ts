/// <reference path="../types/express.d.ts" />
import { NextFunction, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "../models/User";
import { AuthRequest } from "../types";

interface DecodedToken extends JwtPayload {
  id: string;
}

const extractToken = (req: AuthRequest): string | null => {
  const authHeader =
    req.header("Authorization") ?? req.headers.authorization ?? null;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  return authHeader.split(" ")[1];
};

const verifyToken = async (token: string) => {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error("JWT_SECRET is not defined");
  }
  const decoded = jwt.verify(token, jwtSecret) as DecodedToken;
  return User.findById(decoded.id).select("-password");
};

const auth = async (req: AuthRequest, res: Response, next: NextFunction) => {
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
  } catch {
    return res.status(401).json({ error: "Token is not valid" });
  }
};

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
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
  } catch {
    return res.status(401).json({ error: "Token is not valid" });
  }
};

export default auth;
