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

export const useWatchlistStore = create((set, get) => ({
  //Initial state
  watchlist: [], //watchlists are initially empty
  currentWatchlist: null,
  isLoading: false, //no loading taking place to begin with, since nothing is being done here
  loading: false, //no loading taking place to begin with, since nothing is being done here
  error: null, //no error arising from an action (fetching, adding, deleting watchlists etc)

  //Define the actions
  getWatchlist: async () => {
    //fetch watchlists from movie database library
    try {
      set({ loading: true });
      const watchlist = await getWatchlistAPI(); //fetch watchlists from movie database library
      set({ watchlist, loading: false }); //set the fetched watchlist to the watchlist state
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  fetchWatchlistById: async (watchlistId) => {
    try {
      set({ isLoading: true, error: null });
      const watchlist = await getWatchlistByIdAPI(watchlistId); //fetch watchlist by id
      set({ currentWatchlist: watchlist, isLoading: false }); //set the fetched watchlist to the currentWatchlist state
    } catch (error) {
      set({ error: error.message, isLoading: false, currentWatchlist: null }); //catch any other errors
    }
  },

  createWatchlist: async (watchlistName, description) => {
    try {
      set({ loading: true });
      const newWatchlist = await createWatchlistAPI(watchlistName, description); //create a new watchlist
      set((state) => ({
        watchlist: [...state.watchlist, newWatchlist],
        loading: false,
      })); //add the new watchlist to the watchlist array
      return newWatchlist;
    } catch (error) {
      set({ error: error.message, loading: false }); //catch any other errors
    }
  },

  addItemToWatchlist: async (watchlistId, item) => {
    try {
      set({ loading: true });
      const updatedWatchlist = await addItemToWatchlist(watchlistId, item); //add an item to the watchlist
      set((state) => ({
        watchlist: state.watchlist.map((watchlist) =>
          watchlist.id === watchlistId ? updatedWatchlist : watchlist
        ),
        loading: false,
      })); //add the new item to the watchlist array and update the collection
    } catch (error) {
      set({ error: error.message, loading: false }); //catch any other errors
    }
  },

  updateWatchlist: async (watchlistId, newWatchlistName) => {
    try {
      set({ loading: true });
      const updatedWatchlist = await updateWatchlistAPI(
        watchlistId,
        newWatchlistName
      );

      // Update the watchlist in the state using if statements
      set((state) => ({
        watchlist: state.watchlist.map((watchlist) => {
          if (watchlist.id === watchlistId) {
            return updatedWatchlist; // Update the watchlist with the new data
          } else {
            return watchlist; // Keep the watchlist unchanged
          }
        }),
        loading: false,
      }));
    } catch (error) {
      set({ error: error.message, loading: false }); // Handle any errors
    }
  },

  removeItemFromWatchlist: async (watchlistId, itemId) => {
    try {
      set({ loading: true }); // 1.1 Start loading state
      await removeItemFromWatchlistAPI(watchlistId, itemId); // 1.2 Call backend API to remove item
      // 1.3 Update local state to remove item from the correct watchlist
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
      // 1.4 Optionally, also update currentWatchlist if you're on the detail page
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
      return true; // 1.5 Indicate success
    } catch (error) {
      set({ error: error.message, loading: false });
      return false; // 1.6 Indicate failure
    }
  },

  deleteWatchlist: async (watchlistId) => {
    try {
      set({ loading: true }); // Start showing loading.
      await deleteWatchlistAPI(watchlistId); //delete watchlist from database using specified watchlistId
      set((state) => ({
        watchlist: state.watchlist.filter(
          (watchlist) => watchlist._id !== watchlistId
        ), //remove the watchlist from the watchlist stated the new item to the watchlist array
        currentWatchlist: null,
        loading: false,
      })); //remove the watchlist from the watchlist stated the new item to the watchlist array
      return true;
    } catch (error) {
      set({ error: error.message, loading: false }); //catch any other errors
      return false; // Indicate failure
    }
  },

  ensureWatchedWatchlist: async () => {
    let watched = null;
    // Find "Watched" watchlist in state
    watched = get().watchlist.find((wl) => wl.name === "Watched");
    if (!watched) {
      // Create if not found (createWatchlist already adds it to state)
      watched = await get().createWatchlist(
        "Watched",
        "All items you have watched"
      );
    }
    return watched;
  },
}));
