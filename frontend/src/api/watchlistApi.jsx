import axios from 'axios';

const BASE_URL = "http://localhost:5000/api";

//Function to create a new watchlist by sending a POST request
export const createWatchlistAPI = async (watchlistName, description) => {
    try {
        const response = await axios.post(`${BASE_URL}/watchlist/create`,
            {
                name: watchlistName,
                description
                
            });
        return response.data //Contains new watchlist data
     } catch (error) {
        console.log("Error creating watchlist:", error.message);
        throw error;
     }
};

//Function to add a new watchlist by sending a POST request
export const addItemToWatchlist = async (watchlistId, item) => {
    try {
        const response = await axios.post(`${BASE_URL}/watchlist/${watchlistId}/add-item`, item)
        return response.data;
    } catch (error) {
        console.log("Error adding item to watchlist:", error.message);
        throw error;
     }
}

//Function to fetch watchlist by sending a GET request
export const getWatchlistAPI = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/watchlist/create`);
        return response.data
    } catch (error) {
        console.log("Error fetching watchlist:", error.message);
        throw error;
    }
}

//Function to update watchlist by sending a PUT request
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
 
//Function to delete watchlist by sending a DELETE request
export const deleteWatchlistAPI = async (watchlistId) => {
    try {
        const response = await axios.delete(`${BASE_URL}/watchlist/${watchlistId}`);
        return response.data;
    } catch (error) {
        console.log("Error deleting watchlist:", error.message);
        throw error;
    }
}

//Function to remove item from watchlist by sending a DELETE request
export const removeItemFromWatchlistAPI = async (watchlistId, itemId) => {
    try {
        const response = await axios.delete(`${BASE_URL}/watchlist/${watchlistId}/remove-item/${itemId}`);
        return response.data;
    } catch (error) {
        console.log("Error deleting item from watchlist:", error.message);
        throw error;
    }
}

