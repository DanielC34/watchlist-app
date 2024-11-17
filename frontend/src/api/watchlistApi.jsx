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