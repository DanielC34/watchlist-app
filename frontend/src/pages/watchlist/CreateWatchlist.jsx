import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Heading,
  useToast,
  Container,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
// Import the API function instead of using axios directly
import { createWatchlistAPI } from "../../api/watchlistApi";
// Import the store to update state after creation
import { useWatchlistStore } from "../../store/useWatchlistStore";

const CreateWatchlist = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  // Get the createWatchlist function from the store
  const createWatchlist = useWatchlistStore((state) => state.createWatchlist);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!name.trim()) {
      toast({
        title: "Name is required",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Send request to create watchlist
      // Use the store function instead of direct axios call
      const newWatchlist = await createWatchlist(name, description);

      // Show success message
      toast({
        title: "Watchlist created!",
        description: `"${name}" has been created successfully.`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      // Navigate to the new watchlist
      navigate(`/watchlist/${newWatchlist._id}`);
    } catch (error) {
      // Show error message
      toast({
        title: "Error creating watchlist",
        description: error.response?.data?.message || "Something went wrong",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      console.error("Create watchlist error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxW="container.md" py={8}>
      <Heading mb={6}>Create New Watchlist</Heading>
      <Box
        as="form"
        onSubmit={handleSubmit}
        bg="gray.800"
        p={6}
        borderRadius="md"
      >
        <FormControl isRequired mb={4}>
          <FormLabel>Name</FormLabel>
          <Input
            placeholder="My Favorite Movies"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </FormControl>

        <FormControl mb={6}>
          <FormLabel>Description (Optional)</FormLabel>
          <Textarea
            placeholder="A collection of movies I want to watch later"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
          />
        </FormControl>

        <Button
          colorScheme="red"
          type="submit"
          isLoading={isSubmitting}
          width="full"
        >
          Create Watchlist
        </Button>
      </Box>
    </Container>
  );
};

export default CreateWatchlist;
