// src/store/useAuthStore.js
import { create } from "zustand";
import axios from "axios";

const ROOT_URL = import.meta.env.VITE_ROOT_URL || "http://localhost:5000";


const useAuthStore = create((set) => ({
  user: null,
  error: null,
  clearError: () => set({ error: null }),
  signup: async (username, email, password) => {
    try {
      const response = await axios.post(`${ROOT_URL}/api/auth/register`, {
        username,
        email,
        password,
      });
      set({ user: response.data.user, error: null });
    } catch (err) {
      set({ user: null, error: err.response?.data?.message || "An error in signup occurred" });
      throw err;
    }
  },
  login: async (email, password) => {
    try {
      const response = await axios.post(`${ROOT_URL}/api/auth/login`, {
        email,
        password,
      });
      localStorage.setItem("token", response.data.token);
      set({ user: response.data.user, error: null });
    } catch (err) {
      set({
        user: null,
        error: err.response?.data?.message || "An error occurred",
      });
      throw err; // Rethrow error to handle it in the component
    }
  },
  logout: () => {
    localStorage.removeItem("token");
    set({ user: null });
  },
}));

export default useAuthStore;
