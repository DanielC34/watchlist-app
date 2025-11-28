import { Request } from "express";

export interface IUser {
  _id: string;
  username: string;
  email: string;
  password: string;
  profilePicture?: string;
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
