import { create } from "zustand";
import axios from "axios";

const ROOT_URL = import.meta.env.VITE_ROOT_URL || "http://localhost:5000";

const useAuthStore = create((set) => ({
  // Initial state for user and authentication
  user: {
    username: "",
    email: "",
  },
  isAuthenticated: false,
  error: null,

  clearError: () => set({ error: null }),

  // Function to handle user signup
  signup: async (username, email, password) => {
    try {
      const response = await axios.post(`${ROOT_URL}/api/auth/register`, {
        username,
        email,
        password,
      });

      set({
        user: response.data.user,
        isAuthenticated: true,
        error: null,
      });

      // Store the token in localStorage for persistence
      localStorage.setItem("token", response.data.token);
    } catch (err) {
      set({
        user: { username: "", email: "" },
        isAuthenticated: false,
        error: err.response?.data?.message || "Signup failed",
      });
      throw err;
    }
  },

  // Function to handle user login
  login: async (email, password) => {
    try {
      const response = await axios.post(`${ROOT_URL}/api/auth/login`, {
        email,
        password,
      });

      console.log("Login response:", response); // Debug log

      if (response.data.user && response.data) {
        set({
          user: response.data.user,
          isAuthenticated: true,
          error: null,
        });

        // Store the token in localStorage for persistence
        localStorage.setItem("token", response.data.token);
      } else {
        set({
          user: { username: "", email: "" },
          isAuthenticated: false,
          error: "Login failed: User data not found",
        });
      }
    } catch (err) {
      console.error("Login error:", err.response || err); // Debug log
      set({
        user: { username: "", email: "" },
        isAuthenticated: false,
        error: err.response?.data?.message || "Login failed",
      });
      throw err;
    }
  },

  // Function to handle user logout
  logout: () => {
    // Clear token from localStorage
    localStorage.removeItem("token");
    set({
      user: { username: "", email: "" },
      isAuthenticated: false,
    });
  },

  // Function to check authentication state on initial load
  checkAuthOnLoad: () => {
    const token = localStorage.getItem("token");
    if (token) {
      // Make a request to validate the token if necessary, or just set the state
      //checks if a token is stored in localStorage when the app first loads. If a token exists, the app assumes the user is still authenticated.
      set({
        isAuthenticated: true,
        error: null,
      });
    }
  },
}));

export default useAuthStore;
