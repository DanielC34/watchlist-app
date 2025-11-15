export interface User {
  _id: string;
  username: string;
  email: string;
  profilePicture?: string;
}

export interface Movie {
  id: number;
  title?: string;
  name?: string;
  poster_path: string;
  backdrop_path?: string;
  overview: string;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  media_type?: 'movie' | 'tv';
  genre_ids?: number[];
}

export interface WatchlistItem {
  _id: string;
  movieId: string;
  title: string;
  poster_path: string;
  media_type: 'movie' | 'tv';
  addedAt: string;
}

export interface Watchlist {
  _id: string;
  name: string;
  description?: string;
  items: WatchlistItem[];
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  signup: (username: string, email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  updateProfilePicture: (file: File) => Promise<void>;
}

export interface WatchlistState {
  watchlist: Watchlist[];
  loading: boolean;
  error: string | null;
  getWatchlist: () => Promise<void>;
  createWatchlist: (name: string, description?: string) => Promise<Watchlist>;
  deleteWatchlist: (id: string) => Promise<void>;
  addItemToWatchlist: (watchlistId: string, item: Omit<WatchlistItem, '_id' | 'addedAt'>) => Promise<void>;
  removeItemFromWatchlist: (watchlistId: string, itemId: string) => Promise<void>;
}
