// src/types/express.d.ts
import { IUser } from "./index";

declare global {
  namespace Express {
    // Overrides/extends Express.User so req.user has your IUser fields
    interface User extends IUser {}

    // Extends Express.Request object
    interface Request {
      csrfToken(): string; // Provided by csurf middleware
      user?: User; // Provided by Passport or your auth middleware
    }
  }
}

export {};
