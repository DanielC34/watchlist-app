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
  const [watchlistName, setWatchlistName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  // Using Zustand store for creating a watchlist
  const createWatchlist = useWatchlistStore((state) => state.createWatchlist);

  // Toast for displaying success or error messages
  const toast = useToast();

  const handleCreateWatchlist = async () => {
    setLoading(true);

    // Input validation (if name is empty)
    if (!watchlistName) {
      toast({
        title: "Error",
        description: "Please provide a name for the watchlist.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setLoading(false);
      return; //stop further execution
    }

    //Error check for number of characters in watchlist name
    if (watchlistName.length < 10 || watchlistName.length > 100) {
      toast({
        title: "Error",
        description: "Watchlist name must be between 50 and 100 characters.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setLoading(false);
      return; //stop further execution
    }

    //Error check for number of characters in watchlist description
    if (description && (description.length < 10 || description.length > 300)) {
      toast({
        title: "Error",
        description:
          "Watchlist description must be between 200 and 300 characters.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setLoading(false);
      return; //stop further execution
    }

    try {
      // Create the watchlist by calling the store function
      await createWatchlist(watchlistName, description || ""); // Description is optional

      toast({
        title: "Success",
        description: "Your watchlist has been created.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // Reset input fields
      setWatchlistName("");
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
        <FormLabel fontWeight="bold" color="white" htmlFor="watchlistName">
          Watchlist Name
        </FormLabel>
        <Input
          placeholder="Example: My Favorites, Top Movies..."
          size="lg"
          id="watchlistName"
          type="text"
          value={watchlistName}
          mb={4}
          onChange={(e) => setWatchlistName(e.target.value)}
        />
      </FormControl>

      {/* Watchlist Description */}
      <FormControl marginBottom="6">
        <FormLabel fontWeight="bold" color="white" htmlFor="description">
          Watchlist Description{" "}
          <span style={{ fontWeight: "normal", fontSize: "sm" }}>
            (Optional)
          </span>
        </FormLabel>
        <Textarea
          placeholder="Describe the watchlist content..."
          value={description}
          id="description"
          type="text"
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
