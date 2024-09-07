// Import required modules
import React, { useState, useEffect } from "react";
import {
  Box,
  Avatar,
  Button,
  Input,
  FormControl,
  FormLabel,
  useToast,
  Text,
  VStack,
} from "@chakra-ui/react";
import useAuthStore from "../../store/useAuthStore";

const Profile = () => {
  // Initialize state from the Auth Store
  const { user, fetchUserProfile, updateUserProfilePicture, checkAuthOnLoad } =
    useAuthStore((state) => ({
      user: state.user,
      fetchUserProfile: state.fetchUserProfile,
      updateUserProfilePicture: state.updateUserProfilePicture,
      checkAuthOnLoad: state.checkAuthOnLoad,
    }));

  const [newProfilePicture, setNewProfilePicture] = useState(null);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    checkAuthOnLoad();
  }, [checkAuthOnLoad]);

  // Fetch user profile details when the component mounts
  useEffect(() => {
    if (!user?.username) {
      // Update to ensure fetching only when user details are missing
      fetchUserProfile();
    }
  }, [fetchUserProfile, user]);

  // Handle profile picture change
  const handleProfilePictureChange = (event) => {
    setNewProfilePicture(event.target.files[0]); // Store the selected file
  };

  // Handle submission of updated profile picture
  const handleSubmit = async () => {
    if (!newProfilePicture) {
      toast({
        title: "Please select a picture to upload.",
        status: "warning",
        duration: 3000,
      });
      return;
    }

    setLoading(true); // Set loading state to true
    try {
      await updateUserProfilePicture(newProfilePicture); // Call API function to update the picture
      toast({
        title: "Profile picture updated successfully!",
        status: "success",
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Failed to update profile picture.",
        status: "error",
        duration: 3000,
      });
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <Box
      p={4}
      bg="gray.700"
      color="white"
      maxWidth="400px"
      mx="auto"
      mt={6}
      borderRadius="md"
      boxShadow="md"
    >
      <VStack spacing={4}>
        <Avatar size="xl" src={user?.profilePicture} />
        <Text fontSize="lg" fontWeight="bold">
          {user?.username || "Username not available"}
        </Text>
        <Text fontSize="md">{user?.email || "Email not available"}</Text>

        <FormControl>
          <FormLabel>Change Profile Picture</FormLabel>
          <Input type="file" onChange={handleProfilePictureChange} />
        </FormControl>

        <Button colorScheme="blue" onClick={handleSubmit} isLoading={loading}>
          Save Changes
        </Button>
      </VStack>
    </Box>
  );
};

export default Profile;
