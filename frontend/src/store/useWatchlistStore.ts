import { create } from "zustand";
import {
  getWatchlistAPI,
  createWatchlistAPI,
  addItemToWatchlist,
  updateWatchlistAPI,
  removeItemFromWatchlistAPI,
  deleteWatchlistAPI,
  getWatchlistByIdAPI,
} from "../api/watchlistApi";
import { Watchlist, WatchlistItem } from "../types";

interface WatchlistState {
  watchlist: Watchlist[];
  currentWatchlist: Watchlist | null;
  isLoading: boolean;
  loading: boolean;
  error: string | null;
  getWatchlist: () => Promise<void>;
  fetchWatchlistById: (watchlistId: string) => Promise<void>;
  createWatchlist: (watchlistName: string, description?: string) => Promise<Watchlist | undefined>;
  addItemToWatchlist: (watchlistId: string, item: Omit<WatchlistItem, '_id' | 'addedAt'>) => Promise<void>;
  updateWatchlist: (watchlistId: string, newWatchlistName: string) => Promise<void>;
  removeItemFromWatchlist: (watchlistId: string, itemId: string) => Promise<boolean>;
  deleteWatchlist: (watchlistId: string) => Promise<boolean>;
  ensureWatchedWatchlist: () => Promise<Watchlist | undefined>;
}

export const useWatchlistStore = create<WatchlistState>((set, get) => ({
  watchlist: [],
  currentWatchlist: null,
  isLoading: false,
  loading: false,
  error: null,

  getWatchlist: async () => {
    try {
      set({ loading: true });
      const watchlist = await getWatchlistAPI();
      set({ watchlist, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  fetchWatchlistById: async (watchlistId: string) => {
    try {
      set({ isLoading: true, error: null });
      const watchlist = await getWatchlistByIdAPI(watchlistId);
      set({ currentWatchlist: watchlist, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false, currentWatchlist: null });
    }
  },

  createWatchlist: async (watchlistName: string, description?: string) => {
    try {
      set({ loading: true });
      const newWatchlist = await createWatchlistAPI(watchlistName, description);
      set((state) => ({
        watchlist: [...state.watchlist, newWatchlist],
        loading: false,
      }));
      return newWatchlist;
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  addItemToWatchlist: async (watchlistId: string, item: Omit<WatchlistItem, '_id' | 'addedAt'>) => {
    try {
      set({ loading: true });
      const updatedWatchlist = await addItemToWatchlist(watchlistId, item);
      set((state) => ({
        watchlist: state.watchlist.map((watchlist) =>
          watchlist._id === watchlistId ? updatedWatchlist : watchlist
        ),
        loading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  updateWatchlist: async (watchlistId: string, newWatchlistName: string) => {
    try {
      set({ loading: true });
      const updatedWatchlist = await updateWatchlistAPI(
        watchlistId,
        newWatchlistName
      );

      set((state) => ({
        watchlist: state.watchlist.map((watchlist) => {
          if (watchlist._id === watchlistId) {
            return updatedWatchlist;
          } else {
            return watchlist;
          }
        }),
        loading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  removeItemFromWatchlist: async (watchlistId: string, itemId: string) => {
    try {
      set({ loading: true });
      await removeItemFromWatchlistAPI(watchlistId, itemId);
      set((state) => ({
        watchlist: state.watchlist.map((watchlist) => {
          if (watchlist._id === watchlistId) {
            return {
              ...watchlist,
              items: watchlist.items.filter((item) => item._id !== itemId),
            };
          }
          return watchlist;
        }),
        loading: false,
      }));
      set((state) => ({
        currentWatchlist:
          state.currentWatchlist && state.currentWatchlist._id === watchlistId
            ? {
                ...state.currentWatchlist,
                items: state.currentWatchlist.items.filter(
                  (item) => item._id !== itemId
                ),
              }
            : state.currentWatchlist,
      }));
      return true;
    } catch (error: any) {
      set({ error: error.message, loading: false });
      return false;
    }
  },

  deleteWatchlist: async (watchlistId: string) => {
    try {
      set({ loading: true });
      await deleteWatchlistAPI(watchlistId);
      set((state) => ({
        watchlist: state.watchlist.filter(
          (watchlist) => watchlist._id !== watchlistId
        ),
        currentWatchlist: null,
        loading: false,
      }));
      return true;
    } catch (error: any) {
      set({ error: error.message, loading: false });
      return false;
    }
  },

  ensureWatchedWatchlist: async () => {
    let watched = null;
    watched = get().watchlist.find((wl) => wl.name === "Watched");
    if (!watched) {
      watched = await get().createWatchlist(
        "Watched",
        "All items you have watched"
      );
    }
    return watched;
  },
}));
