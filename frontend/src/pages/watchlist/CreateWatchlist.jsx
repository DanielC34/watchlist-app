import React, { useState } from "react";
import {
  Button,
  Input,
  FormControl,
  FormLabel,
  Textarea,
  Box,
  Heading,
  useToast,
} from "@chakra-ui/react";
import {useWatchlistStore}  from "../../store/useWatchlistStore";

const CreateWatchlist = () => {
  // State to manage the inputs for name and description
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  // Using Zustand store for creating a watchlist
  const createWatchlist = useWatchlistStore((state) => state.createWatchlist);

  // Toast for displaying success or error messages
  const toast = useToast();

  const handleCreateWatchlist = async () => {
    setLoading(true);

    // Input validation
    if (!name) {
      toast({
        title: "Error",
        description: "Please provide a name for the watchlist.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setLoading(false);
      return;
    }

    try {
      // Create the watchlist by calling the store function
      await createWatchlist(name, description || ""); // Description is optional
      toast({
        title: "Success",
        description: "Your watchlist has been created.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // Reset input fields
      setName("");
      setDescription("");
    } catch (error) {
      console.error("Error creating watchlist:", error); // Log the error to the console
      toast({
        title: "Error",
        description:
          "There was an issue creating the watchlist. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      maxWidth="800px"
      margin="0 auto"
      padding="6"
      borderRadius="md"
      boxShadow="md"
      backgroundColor="gray.700"
    >
      <Heading
        as="h2"
        size="lg"
        marginBottom="6"
        textAlign="center"
        color="white"
      >
        Create a New Watchlist
      </Heading>

      {/* Watchlist Name */}
      <FormControl isRequired marginBottom="4">
        <FormLabel fontWeight="bold" color="white">
          Watchlist Name
        </FormLabel>
        <Input
          placeholder="Example: My Favorites, Top Movies..."
          size="lg"
          mb={4}
          onChange={(e) => setName(e.target.value)}
        />
      </FormControl>

      {/* Watchlist Description */}
      <FormControl marginBottom="6">
        <FormLabel fontWeight="bold" color="white">
          Watchlist Description{" "}
          <span style={{ fontWeight: "normal", fontSize: "sm" }}>
            (Optional)
          </span>
        </FormLabel>
        <Textarea
          placeholder="Describe the watchlist content..."
          size="lg"
          onChange={(e) => setDescription(e.target.value)}
        />
      </FormControl>

      {/* Submit Button */}
      <Box textAlign="center">
        <Button
          colorScheme="red"
          variant="solid"
          size="lg"
          width="100%"
          onClick={handleCreateWatchlist}
          isLoading={loading}
        >
          + Create Watchlist
        </Button>
      </Box>
    </Box>
  );
};

export default CreateWatchlist;
