import { create } from "zustand";
import axios from "axios";
import {
  getUserProfile,
  updateUserProfilePicture as updatePicture,
} from "../utilities/api";

const ROOT_URL = import.meta.env.VITE_ROOT_URL || "http://localhost:5000";

const useAuthStore = create((set) => ({
  // Initial state for user and authentication
  user: JSON.parse(localStorage.getItem("user")) || { username: "", email: "" }, // Initialize from localStorage
  isAuthenticated: !!localStorage.getItem("token"), // Check if token exists in localStorage
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

      // Store the token and user data in localStorage for persistence
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
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

      if (response.data.user && response.data.token) {
        set({
          user: response.data.user,
          isAuthenticated: true,
          error: null,
        });

        // Store the token and user data in localStorage for persistence
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
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
    // Clear token and user data from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    set({
      user: { username: "", email: "" },
      isAuthenticated: false,
    });
  },

  // Function to check authentication state on initial load
  checkAuthOnLoad: () => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      set({
        user: JSON.parse(storedUser), // Parse user data from localStorage
        isAuthenticated: true,
        error: null,
      });
    }
  },

  // Function to fetch user profile details from the backend
  fetchUserProfile: async () => {
    try {
      const response = await axios.get(`${ROOT_URL}/api/users/me`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      set({ user: response.data, isAuthenticated: true }); // Store fetched user data
      localStorage.setItem("user", JSON.stringify(response.data)); // Store user data in localStorage
    } catch (error) {
      console.error("Failed to fetch user profile", error);
      set({ error: "Failed to fetch profile" });
    }
  },

  // Function to update user profile picture
  updateUserProfilePicture: async (file) => {
    try {
      const formData = new FormData();
      formData.append("profilePicture", file);

      const response = await axios.post(
        `${ROOT_URL}/api/users/update-profile-picture`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Update the profile picture in the state
      set({ user: { ...response.data }, isAuthenticated: true, error: null });
      localStorage.setItem("user", JSON.stringify(response.data)); // Store updated user data in localStorage
    } catch (err) {
      set({
        error:
          err.response?.data?.message || "Failed to update profile picture",
      });
    }
  },
}));

export default useAuthStore;
