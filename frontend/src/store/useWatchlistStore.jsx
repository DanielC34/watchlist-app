import { create } from "zustand";
import {
    getWatchlistAPI,
    createWatchlistAPI,
    addItemToWatchlist,
    updateWatchlistAPI,
    removeItemFromWatchlistAPI,
    deleteWatchlistAPI,
} from "../api/watchlistApi";


export const useWatchlistStore = create((set) => ({
    //Initial state
    watchlist: [], //watchlists are initially empty
    loading: false, //no loading taking place to begin with, since nothing is being done here
    error: null, //no error arising from an action (fetching, adding, deleting watchlists etc)

    //Define the actions
    getWatchlist: async () => { //fetch watchlists from movie database library
        try {
             set({ loading: true });
            const watchlist = await getWatchlistAPI(); //fetch watchlists from movie database library
             set({ watchlist, loading: false }); //set the fetched watchlist to the watchlist state
         } catch (error) {
             set({ error: error.message, loading: false });
         }
    },

    createWatchlist: async (watchlistName) => {
        try {
            set({ loading: true });
            const newWatchlist = await createWatchlistAPI(watchlistName); //create a new watchlist
            set((state) => ({ watchlist: [...state.watchlist, newWatchlist], loading: false })); //add the new watchlist to the watchlist array
        } catch (error) {
            set({ error: error.message, loading: false }); //catch any other errors
        }
    },

    addItemToWatchlist: async (watchlistId, item) => {
        try {
             set({ loading: true });
             const updatedWatchlist = await addItemToWatchlist(watchlistId, item); //add an item to the watchlist
            set((state) => ({
                watchlist: state.watchlist.map((watchlist) => watchlist.id === watchlistId ? updatedWatchlist : watchlist),
                loading: false
            })); //add the new item to the watchlist array and update the collection
         } catch (error) {
             set({ error: error.message, loading: false }); //catch any other errors
         }
    },

    updateWatchlist: async (watchlistId, newWatchlistName) => {
    try {
        set({ loading: true });
        const updatedWatchlist = await updateWatchlistAPI(watchlistId, newWatchlistName);

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
            set({ loading: true }); // Start showing loading.
            await removeItemFromWatchlistAPI(watchlistId, itemId); //delete item from watchlist using specified watchlistId and itemId
          // Update the state to reflect the item has been removed.
          set((state) => ({
            watchlist: state.watchlist.map((watchlist) => {
              // If this is the right watchlist, update its items.
              if (watchlist._id === watchlistId) {
                return {
                  ...watchlist,
                  items: watchlist.items.filter((item) => item._id !== itemId), // Remove the item.
                };
              }
              // If not, return the watchlist unchanged.
              return watchlist;
            }),
            loading: false, // Stop showing loading.
          }));
        } catch (error) {
             set({ error: error.message, loading: false }); //catch any other errors
         }
    },

    deleteWatchlist: async (watchlistId) => {
        try {
            set({ loading: true }); // Start showing loading.
             await deleteWatchlistAPI(watchlistId); //delete watchlist from database using specified watchlistId
            set((state) => ({
                watchlist: state.watchlist.filter((watchlist) => watchlist._id !== watchlistId), //remove the watchlist from the watchlist statedd the new item to the watchlist array
                 loading: false
            })); //remove the watchlist from the watchlist stated the new item to the watchlist array
         } catch (error) {
             set({ error: error.message, loading: false }); //catch any other errors
         }
    }



}));

