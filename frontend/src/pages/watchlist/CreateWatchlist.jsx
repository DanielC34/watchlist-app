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
import useWatchlistStore  from "../../store/useWatchlistStore";

const [watchlistName, setWatchlistName] = useState('');
const [description, setDescription] = useState('');
const [loading, setLoading] = useState(false);

const createWatchlist = useWatchlistStore(state => state.createWatchlist);
const toast = useToast();

const CreateWatchlist = () => {
  setLoading(true);

  if (!watchlistName) {
    toast({
      title: "Error",
      description: "Please provide a name for the watchlist",
      status: "error",
      duration: 3000,
      isClosable: true,
    });
    setLoading(false);
    return;
  }

  try {
    await createWatchlist(watchlistName, description || "");
  } catch (error) {
    
  }


  return (
    <Box
      maxWidth="800px"
      margin="0 auto"
      padding="6"
      borderRadius="md"
      boxShadow="md"
      backgroundColor="gray.700"
    >
      <Heading as="h2" size="lg" marginBottom="6" textAlign="center" color="white">
        Create a New Watchlist
      </Heading>

      {/* Watchlist Name */}
      <FormControl isRequired marginBottom="4">
        <FormLabel fontWeight="bold" color="white">
          Watchlist Name
        </FormLabel>
        <Input placeholder="Example: My Favorites, Top Movies..." size="lg" />
      </FormControl>

      {/* Watchlist Description */}
      <FormControl marginBottom="6">
        <FormLabel fontWeight="bold" color="white">
          Watchlist Description{" "}
          <span style={{ fontWeight: "normal", fontSize: "sm" }}>
            (Optional)
          </span>
        </FormLabel>
        <Textarea placeholder="Describe the watchlist content..." size="lg" />
      </FormControl>

      {/* Submit Button */}
      <Box textAlign="center">
        <Button colorScheme="red" variant="solid" size="lg" width="100%">
          + Create Watchlist
        </Button>
      </Box>
    </Box>
  );
};

export default CreateWatchlist;
