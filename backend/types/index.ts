import { Request } from 'express';

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
  _id: string;
  movieId: string;
  title: string;
  poster_path: string;
  media_type: 'movie' | 'tv';
  addedAt: Date;
}

export interface IWatchlist {
  _id: string;
  name: string;
  description?: string;
  items: IWatchlistItem[];
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthRequest extends Request {
  user?: IUser;
  session: Request['session'] & {
    userId?: string;
  };
}
