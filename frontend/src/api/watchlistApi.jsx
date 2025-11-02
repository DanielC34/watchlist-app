import axios from 'axios';

// Validate BASE_URL to prevent SSRF attacks
const validateBaseUrl = (url) => {
  const allowedHosts = ['localhost', '127.0.0.1', 'your-api-domain.com'];
  try {
    const urlObj = new URL(url);
    return allowedHosts.some(host => urlObj.hostname === host || urlObj.hostname.endsWith(`.${host}`));
  } catch {
    return false;
  }
};

const BASE_URL = import.meta.env.VITE_API_URL;
if (!validateBaseUrl(BASE_URL)) {
  throw new Error('Invalid API URL - potential SSRF attack');
}
const API_TIMEOUT = import.meta.env.VITE_API_TIMEOUT || 10000;

// Configure axios with default headers and timeout
const api = axios.create({
  baseURL: BASE_URL,
  timeout: API_TIMEOUT,
});

// Add request interceptor to include auth token in all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

//Function to create a new watchlist by sending a POST request
export const createWatchlistAPI = async (watchlistName, description) => {
    try {
        const response = await api.post(`/watchlist/create`, {
            name: watchlistName,
            description,
        });
        return response.data; //Contains new watchlist data
     } catch (error) {
        const errorMessage = error.response?.data?.message || "Failed to create watchlist";
        throw new Error(errorMessage);
     }
};

//Function to add a new watchlist by sending a POST request
export const addItemToWatchlist = async (watchlistId, item) => {
    try {
        // Validate watchlistId to prevent SSRF
        if (!watchlistId || typeof watchlistId !== 'string' || !/^[a-zA-Z0-9]+$/.test(watchlistId)) {
            throw new Error('Invalid watchlist ID');
        }
        const response = await api.post(`/watchlist/${watchlistId}/add-item`, item);
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || "Failed to add item to watchlist";
        throw new Error(errorMessage);
    }
};

//Function to fetch watchlist by sending a GET request
export const getWatchlistAPI = async () => {
    try {
        const response = await api.get('/watchlist'); // Fixed endpoint
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || "Failed to fetch watchlists";
        throw new Error(errorMessage);
    }
};

//Function to fetch a specific watchlist by ID
export const getWatchlistByIdAPI = async (watchlistId) => {
    try {
        const response = await api.get(`/watchlist/${watchlistId}`);
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || "Failed to fetch watchlist";
        throw new Error(errorMessage);
    }
};

//Function to update watchlist by sending a PUT request
export const updateWatchlistAPI = async (watchlistId, newWatchlistName) => {
    try {
        const response = await api.put(`/watchlist/update`, {
            watchlistId,
            newWatchlistName
        });
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || "Failed to update watchlist";
        throw new Error(errorMessage);
    }
};
 
//Function to delete watchlist by sending a DELETE request
export const deleteWatchlistAPI = async (watchlistId) => {
    try {
        const response = await api.delete(`/watchlist/${watchlistId}`);
        return response.data;
    } catch (error) {
        const errorMessage = 
            error.response?.data?.message || 
            error.response?.data?.error || 
            "Failed to delete watchlist";
        throw new Error(errorMessage);
    }
};

//Function to remove item from watchlist by sending a DELETE request
export const removeItemFromWatchlistAPI = async (watchlistId, itemId) => {
    try {
        const response = await api.delete(`/watchlist/${watchlistId}/items/${itemId}`);
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || "Failed to remove item from watchlist";
        throw new Error(errorMessage);
    }
};

