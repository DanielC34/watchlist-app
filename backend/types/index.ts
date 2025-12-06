import { Request } from "express";

export interface IUser {
  _id: string;
  username: string;
  email: string;
  password: string;
  profilePicture?: string;
  followers: string[];
  following: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IWatchlistItem {
  _id?: string;
  movieId: string;
  title: string;
  posterPath?: string;
  mediaType: "movie" | "tv";
  releaseDate?: string;
  addedAt: Date;
  status?: "watched" | "watching" | "plan_to_watch";
  rating?: number; // 1-5
  personalNotes?: string;
}

export interface IWatchlist {
  _id?: string;
  name: string;
  description?: string;
  items: IWatchlistItem[];
  userId: string | any; // Can be ObjectId from MongoDB
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthRequest extends Request {
  user?: Express.User;
  session: Request["session"] & {
    userId?: string;
  };
}
