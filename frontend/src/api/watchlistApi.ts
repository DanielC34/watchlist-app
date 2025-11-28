import axios, { AxiosInstance } from "axios";
import { Watchlist, WatchlistItem } from "../types";

const validateBaseUrl = (url: string): boolean => {
  const allowedHosts = ["localhost", "127.0.0.1", "your-api-domain.com"];
  try {
    const urlObj = new URL(url);
    return allowedHosts.some(
      (host) => urlObj.hostname === host || urlObj.hostname.endsWith(`.${host}`)
    );
  } catch {
    return false;
  }
};

const BASE_URL = import.meta.env.VITE_API_URL;
if (!validateBaseUrl(BASE_URL)) {
  throw new Error("Invalid API URL - potential SSRF attack");
}
const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT) || 10000;

const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: API_TIMEOUT,
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const createWatchlistAPI = async (
  watchlistName: string,
  description?: string
): Promise<Watchlist> => {
  try {
    const csrfResponse = await api.get("/csrf-token");
    const csrfToken = csrfResponse.data.csrfToken;

    const response = await api.post(
      `/watchlist/create`,
      {
        name: watchlistName,
        description,
      },
      {
        headers: {
          "X-CSRF-Token": csrfToken,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || "Failed to create watchlist";
    throw new Error(errorMessage);
  }
};

export const addItemToWatchlist = async (
  watchlistId: string,
  item: Omit<WatchlistItem, "_id" | "addedAt">
): Promise<Watchlist> => {
  try {
    if (
      !watchlistId ||
      typeof watchlistId !== "string" ||
      !/^[a-zA-Z0-9]+$/.test(watchlistId)
    ) {
      throw new Error("Invalid watchlist ID");
    }

    const csrfResponse = await api.get("/csrf-token");
    const csrfToken = csrfResponse.data.csrfToken;

    const response = await api.post(
      `/watchlist/${watchlistId}/add-item`,
      item,
      {
        headers: {
          "X-CSRF-Token": csrfToken,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || "Failed to add item to watchlist";
    throw new Error(errorMessage);
  }
};

export const getWatchlistAPI = async (): Promise<Watchlist[]> => {
  try {
    const response = await api.get("/watchlist");
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || "Failed to fetch watchlists";
    throw new Error(errorMessage);
  }
};

export const getWatchlistByIdAPI = async (
  watchlistId: string
): Promise<Watchlist> => {
  try {
    const response = await api.get(`/watchlist/${watchlistId}`);
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || "Failed to fetch watchlist";
    throw new Error(errorMessage);
  }
};

export const updateWatchlistAPI = async (
  watchlistId: string,
  newWatchlistName: string,
  description?: string
): Promise<Watchlist> => {
  try {
    const csrfResponse = await api.get("/csrf-token");
    const csrfToken = csrfResponse.data.csrfToken;

    const response = await api.put(
      `/watchlist/${watchlistId}`,
      {
        name: newWatchlistName,
        description: description || "",
      },
      {
        headers: {
          "X-CSRF-Token": csrfToken,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || "Failed to update watchlist";
    throw new Error(errorMessage);
  }
};

export const deleteWatchlistAPI = async (
  watchlistId: string
): Promise<{ message: string }> => {
  try {
    const csrfResponse = await api.get("/csrf-token");
    const csrfToken = csrfResponse.data.csrfToken;

    const response = await api.delete(`/watchlist/${watchlistId}`, {
      headers: {
        "X-CSRF-Token": csrfToken,
      },
    });
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Failed to delete watchlist";
    throw new Error(errorMessage);
  }
};

export const removeItemFromWatchlistAPI = async (
  watchlistId: string,
  itemId: string
): Promise<Watchlist> => {
  try {
    const csrfResponse = await api.get("/csrf-token");
    const csrfToken = csrfResponse.data.csrfToken;

    const response = await api.delete(
      `/watchlist/${watchlistId}/items/${itemId}`,
      {
        headers: {
          "X-CSRF-Token": csrfToken,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || "Failed to remove item from watchlist";
    throw new Error(errorMessage);
  }
};
