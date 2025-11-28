import { create } from "zustand";
import axios from "axios";
import { User } from "../types";

const ROOT_URL = import.meta.env.VITE_ROOT_URL || "http://localhost:5000";

interface AuthState {
  user: Partial<User>;
  isAuthenticated: boolean;
  error: string | null;
  clearError: () => void;
  signup: (username: string, email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuthOnLoad: () => void;
  fetchUserProfile: () => Promise<void>;
  updateUserProfilePicture: (file: File) => Promise<void>;
}

const useAuthStore = create<AuthState>((set) => ({
  user: JSON.parse(localStorage.getItem("user") || "{}") || {
    username: "",
    email: "",
  },
  isAuthenticated: !!localStorage.getItem("token"),
  error: null,

  clearError: () => set({ error: null }),

  signup: async (username: string, email: string, password: string) => {
    try {
      const csrfResponse = await axios.get(`${ROOT_URL}/api/csrf-token`, {
        withCredentials: true,
      });
      const csrfToken = csrfResponse.data.csrfToken;

      const response = await axios.post(
        `${ROOT_URL}/api/auth/register`,
        {
          username,
          email,
          password,
          _csrf: csrfToken,
        },
        {
          withCredentials: true,
          headers: {
            "X-CSRF-Token": csrfToken,
          },
        }
      );

      set({
        user: response.data.user,
        isAuthenticated: true,
        error: null,
      });

      const sanitizedUser = {
        username: (response.data.user.username || "").replace(/[<>"'&]/g, ""),
        email: (response.data.user.email || "").replace(/[<>"'&]/g, ""),
      };

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(sanitizedUser));
    } catch (err: any) {
      set({
        user: { username: "", email: "" },
        isAuthenticated: false,
        error: err.response?.data?.message || "Signup failed",
      });
      throw err;
    }
  },

  login: async (email: string, password: string) => {
    try {
      const csrfResponse = await axios.get(`${ROOT_URL}/api/csrf-token`, {
        withCredentials: true,
      });
      const csrfToken = csrfResponse.data.csrfToken;

      const response = await axios.post(
        `${ROOT_URL}/api/auth/login`,
        {
          email,
          password,
          _csrf: csrfToken,
        },
        {
          withCredentials: true,
          headers: {
            "X-CSRF-Token": csrfToken,
          },
        }
      );

      if (response.data.user && response.data.token) {
        set({
          user: response.data.user,
          isAuthenticated: true,
          error: null,
        });

        const sanitizedUser = {
          username: (response.data.user.username || "").replace(/[<>"'&]/g, ""),
          email: (response.data.user.email || "").replace(/[<>"'&]/g, ""),
        };

        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(sanitizedUser));
      } else {
        set({
          user: { username: "", email: "" },
          isAuthenticated: false,
          error: "Login failed: User data not found",
        });
      }
    } catch (err: any) {
      set({
        user: { username: "", email: "" },
        isAuthenticated: false,
        error: err.response?.data?.message || "Login failed",
      });
      throw err;
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    set({
      user: { username: "", email: "" },
      isAuthenticated: false,
    });
  },

  checkAuthOnLoad: () => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      set({
        user: JSON.parse(storedUser),
        isAuthenticated: true,
        error: null,
      });
    }
  },

  fetchUserProfile: async () => {
    try {
      const response = await axios.get(`${ROOT_URL}/api/user/me`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      set({ user: response.data, isAuthenticated: true });
      localStorage.setItem("user", JSON.stringify(response.data));
    } catch (error) {
      console.error("Failed to fetch user profile", error);
      set({ error: "Failed to fetch profile" });
    }
  },

  updateUserProfilePicture: async (file: File) => {
    try {
      const csrfResponse = await axios.get(`${ROOT_URL}/api/csrf-token`, {
        withCredentials: true,
      });
      const csrfToken = csrfResponse.data.csrfToken;

      // Convert file to base64 string for JSON payload
      const reader = new FileReader();

      return new Promise((resolve, reject) => {
        reader.onload = async () => {
          try {
            const base64String = reader.result as string;

            const response = await axios.put(
              `${ROOT_URL}/api/user/profile/picture`,
              {
                newProfilePicture: base64String,
              },
              {
                withCredentials: true,
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                  "X-CSRF-Token": csrfToken,
                },
              }
            );

            set({
              user: { ...response.data },
              isAuthenticated: true,
              error: null,
            });
            localStorage.setItem("user", JSON.stringify(response.data));
            resolve(undefined);
          } catch (err: any) {
            const errorMessage =
              err.response?.data?.message || "Failed to update profile picture";
            set({ error: errorMessage });
            reject(err);
          }
        };

        reader.onerror = () => {
          reject(new Error("Failed to read file"));
        };

        reader.readAsDataURL(file);
      });
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Failed to update profile picture";
      set({ error: errorMessage });
      throw err;
    }
  },
}));

export default useAuthStore;
