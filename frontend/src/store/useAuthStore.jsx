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

      // Log the entire response to debug
      console.log("Login response:", response);

      // Check if the user data exists in the response
      if (response.data.user && response.data) {
        set({
          user: response.data.user,
          isAuthenticated: true,
          error: null,
        });

        localStorage.setItem("token", response.data.token);
      } else {
        set({
          user: { username: "", email: "" },
          isAuthenticated: false,
          error: "Login failed: User data not found",
        });
      }
    } catch (err) {
      console.error("Login error:", err.response || err); // Log the error
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
    localStorage.removeItem("token");
    set({
      user: { username: "", email: "" },
      isAuthenticated: false,
    });
  },
}));

export default useAuthStore;
