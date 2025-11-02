import axios from "axios";

// Fetch user profile details
export const getUserProfile = async () => {
  const response = await axios.get("/api/user/profile");
  return response.data;
};

// Update user profile picture
export const updateUserProfilePicture = async (newPicture) => {
  // Get CSRF token first
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
