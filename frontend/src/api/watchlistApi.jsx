import axios from 'axios';

const BASE_URL = "http://localhost:5000/api";

export const createWatchlistAPI = async (watchlistName) => {
    try {
        const response = await axios.post(`${BASE_URL}/watchlist/create`,
            {
                name: watchlistName 
                
            });
        return response.data //Contains new watchlist data
     } catch (error) {
        console.log("Error creating watchlist:", error.message);
        throw error;
     }
};

export const addItemToWatchlist = async (watchlistId, item) => {
    try {
        const response = await axios.post(`${BASE_URL}/watchlist/${watchlistId}/add-item`, item)
        return response.data;
    } catch (error) {
        console.log("Error adding item to watchlist:", error.message);
        throw error;
     }
}

export const getWatchlistAPI = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/watchlist/create`);
        return response.data
    } catch (error) {
        console.log("Error fetching watchlist:", error.message);
        throw error;
    }
}

export const updateWatchlistAPI = async (watchlistId, newWatchlistName) => {
    try {
        const response = await axios.put(`${BASE_URL}/watchlist/update`, 
            {
                watchlistId,
                newWatchlistName
            }
        )
        return response.data;
    } catch (error) {
        console.log("Error updating watchlist:", error.message);
     }
}
 
export const deleteWatchlistAPI = async (watchlistId) => {
    try {
        const response = await axios.delete(`${BASE_URL}/watchlist/${watchlistId}`);
        return response.data;
    } catch (error) {
        console.log("Error deleting watchlist:", error.message);
        throw error;
    }
}
 
export const removeItemFromWatchlistAPI = async (watchlistId, itemId) => {
    try {
        const response = await axios.delete(`${BASE_URL}/watchlist/${watchlistId}/remove-item/${itemId}`);
        return response.data;
    } catch (error) {
        console.log("Error deleting item from watchlist:", error.message);
        throw error;
    }
}

