import { IUser } from './index';

declare global {
  namespace Express {
    interface Request {
      csrfToken(): string;
    }
    interface User extends IUser {}
  }
}

export {};
