import axios from "axios";
import { User } from "../types";

export const getUserProfile = async (): Promise<User> => {
  const response = await axios.get("/api/user/profile");
  return response.data;
};

export const updateUserProfilePicture = async (newPicture: File): Promise<User> => {
  const csrfResponse = await axios.get("/api/csrf-token", {
    withCredentials: true
  });
  const csrfToken = csrfResponse.data.csrfToken;

  const formData = new FormData();
  formData.append("profilePicture", newPicture);
  formData.append("_csrf", csrfToken);

  const response = await axios.put("/api/user/profile/picture", formData, {
    withCredentials: true,
    headers: {
      "Content-Type": "multipart/form-data",
      'X-CSRF-Token': csrfToken
    },
  });

  return response.data;
};
