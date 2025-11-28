import { useState, FormEvent, ChangeEvent } from "react";
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
import { useWatchlistStore } from "../../store/useWatchlistStore";

const CreateWatchlist = () => {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const toast = useToast();
  const navigate = useNavigate();

  const createWatchlist = useWatchlistStore((state) => state.createWatchlist);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

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
      const newWatchlist = await createWatchlist(name, description);

      toast({
        title: "Watchlist created!",
        description: `"${name}" has been created successfully.`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      if (newWatchlist) {
        navigate(`/watchlist/${newWatchlist._id}`);
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong";

      toast({
        title: "Error creating watchlist",
        description: errorMessage,
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
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setName(e.target.value)
            }
          />
        </FormControl>

        <FormControl mb={6}>
          <FormLabel>Description (Optional)</FormLabel>
          <Textarea
            placeholder="A collection of movies I want to watch later"
            value={description}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              setDescription(e.target.value)
            }
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
