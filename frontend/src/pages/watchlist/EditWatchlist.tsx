import { useState, FormEvent, ChangeEvent, useEffect } from "react";
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
  Spinner,
  Flex,
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import { useWatchlistStore } from "../../store/useWatchlistStore";
import { FaArrowLeft } from "react-icons/fa";

const EditWatchlist = () => {
  const { id } = useParams<{ id: string }>();
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const toast = useToast();
  const navigate = useNavigate();

  const { currentWatchlist, fetchWatchlistById, updateWatchlist } =
    useWatchlistStore();

  useEffect(() => {
    if (id) {
      setIsLoading(true);
      fetchWatchlistById(id).then(() => {
        setIsLoading(false);
      });
    }
  }, [id, fetchWatchlistById]);

  useEffect(() => {
    if (currentWatchlist) {
      setName(currentWatchlist.name);
      setDescription(currentWatchlist.description || "");
    }
  }, [currentWatchlist]);

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

    if (!id) return;

    setIsSubmitting(true);

    try {
      await updateWatchlist(id, name, description);

      toast({
        title: "Watchlist updated!",
        description: `"${name}" has been updated successfully.`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      navigate(`/watchlist/${id}`);
    } catch (error: any) {
      toast({
        title: "Error updating watchlist",
        description: error.message || "Something went wrong",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      console.error("Update watchlist error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Flex justify="center" align="center" minH="50vh">
        <Spinner size="xl" color="red.500" />
      </Flex>
    );
  }

  if (!currentWatchlist) {
    return (
      <Container maxW="container.md" py={8}>
        <Button leftIcon={<FaArrowLeft />} onClick={() => navigate(-1)} mb={4}>
          Back
        </Button>
        <Heading>Watchlist not found</Heading>
      </Container>
    );
  }

  return (
    <Container maxW="container.md" py={8}>
      <Button leftIcon={<FaArrowLeft />} onClick={() => navigate(-1)} mb={6}>
        Back
      </Button>
      <Heading mb={6}>Edit Watchlist</Heading>
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
          Update Watchlist
        </Button>
      </Box>
    </Container>
  );
};

export default EditWatchlist;
