import axios from "axios";

// Fetch user profile details
export const getUserProfile = async () => {
  const response = await axios.get("/api/user/profile");
  return response.data;
};

// Update user profile picture
export const updateUserProfilePicture = async (newPicture) => {
  const formData = new FormData();
  formData.append("profilePicture", newPicture);

  const response = await axios.put("/api/user/profile/picture", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};
