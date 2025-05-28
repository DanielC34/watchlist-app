import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Heading,
  Text,
  Button,
  Grid,
  Flex,
  Spinner,
  useToast,
  IconButton,
  Container,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
} from "@chakra-ui/react";
import {
  FaArrowLeft,
  FaTrash,
  FaEdit,
  FaBookmark,
  FaRegBookmark,
} from "react-icons/fa";
import { useWatchlistStore } from "../../store/useWatchlistStore";
import useAuthStore from "../../store/useAuthStore";

const WatchlistDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const { isAuthenticated } = useAuthStore();
  const { clearError } = useWatchlistStore();

  const {
    fetchWatchlistById,
    currentWatchlist,
    isLoading,
    error,
    removeItemFromWatchlist,
    deleteWatchlist,
  } = useWatchlistStore();

  useEffect(() => {
    if (isAuthenticated) {
      fetchWatchlistById(id);
    }
    return () => {
      clearError(); // Clear errors on unmount/navigation
    };
  }, [id, isAuthenticated, fetchWatchlistById, clearError]);

  const handleRemoveItem = async (itemId) => {
    try {
      await removeItemFromWatchlist(id, itemId);
      toast({
      title: "Item removed",
      status: "success",
      duration: 3000,
      isClosable: true,
      });
    } catch (error) {
      toast({
      title: "Error removing item",
      description: error.message || "Something went wrong.",
      status: "error",
      duration: 3000,
      isClosable: true,
      });
    }
  };

  const handleDeleteWatchlist = async () => {
    if (window.confirm("Are you sure you want to delete this watchlist?")) {
      const success = await deleteWatchlist(id);

      if (success) {
        toast({
          title: "Watchlist deleted",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        navigate("/");
      } else {
        toast({
          title: "Error deleting watchlist",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  // Loading modal overlay
  // Shows while isLoading is true, closes automatically
  const LoadingModal = () => (
    <Modal
      isOpen={isLoading}
      onClose={() => {}}
      isCentered
      closeOnOverlayClick={false}
      blockScrollOnMount={false}
      trapFocus={false}
      motionPreset="none"
    >
      <ModalOverlay bg="rgba(0,0,0,0.7)" />
      <ModalContent bg="transparent" boxShadow="none">
        <ModalBody
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          py={16}
        >
          <Spinner size="2xl" color="red.500" thickness="6px" speed="0.7s" />
          <Text mt={6} color="white" fontWeight="bold" fontSize="lg">
            Loading your watchlist...
          </Text>
        </ModalBody>
      </ModalContent>
    </Modal>
  );

  if (error) {
    return (
      <Container maxW="container.xl" py={4}>
        <Button leftIcon={<FaArrowLeft />} onClick={() => navigate("/home")} mb={4}>
          Back to Home
        </Button>
        <Text color="red.400">Error: {error}</Text>
      </Container>
    );
  }

  if (!currentWatchlist) {
    return (
      <Container maxW="container.xl" py={4}>
      <Button leftIcon={<FaArrowLeft />} onClick={() => navigate(-1)} mb={4}>
        Back
      </Button>
      <Text>Watchlist not found</Text>
      </Container>
    );
  }

  return (
    <>
      <LoadingModal />
      <Container maxW="container.xl" py={4}>
        <Flex justify="space-between" align="center" mb={6}>
          <Button leftIcon={<FaArrowLeft />} onClick={() => navigate(-1)}>
            Back
          </Button>
          <Flex>
            <IconButton
              icon={<FaEdit />}
              aria-label="Edit watchlist"
              mr={2}
              onClick={() => navigate(`/edit-watchlist/${id}`)}
            />
            <IconButton
              icon={<FaTrash />}
              aria-label="Delete watchlist"
              colorScheme="red"
              onClick={handleDeleteWatchlist}
            />
          </Flex>
        </Flex>

        <Heading size="lg" mb={2}>
          {currentWatchlist.name}
        </Heading>
        {currentWatchlist.description && (
          <Text color="gray.400" mb={6}>
            {currentWatchlist.description}
          </Text>
        )}

        {currentWatchlist.items && currentWatchlist.items.length > 0 ? (
          <Grid templateColumns="repeat(auto-fill, minmax(150px, 1fr))" gap={4}>
            {currentWatchlist.items.map((item) => (
              <Box
                key={item._id}
                borderRadius="md"
                overflow="hidden"
                bg="gray.700"
                position="relative"
              >
                {/*2.5 Bin Icon for removing item */}
                <Box position="absolute" top={2} right={2} zIndex={1}>
                  <IconButton
                    icon={<FaTrash />}
                    aria-label="Remove from watchlist"
                    size="sm"
                    colorScheme="red"
                    onClick={() => handleRemoveItem(item._id)}
                  />
                </Box>
                {/* Bookmark icon in top left */}
                <Box position="absolute" top={2} left={2} zIndex={1}>
                  {item.watched ? (
                    <FaBookmark color="#E53E3E" size={20} />
                  ) : (
                    <FaRegBookmark color="#A0AEC0" size={20} />
                  )}
                </Box>
                <Box position="absolute" top={2} right={2} zIndex={1}>
                  <IconButton
                    icon={<FaTrash />}
                    aria-label="Remove from watchlist"
                    size="sm"
                    colorScheme="red"
                    onClick={() => handleRemoveItem(item._id)}
                  />
                </Box>
                <img
                  src={`https://image.tmdb.org/t/p/w500${item.posterPath}`}
                  alt={item.title}
                  style={{ width: "100%", height: "auto" }}
                />
                <Box p={2}>
                  <Text fontWeight="bold" noOfLines={1}>
                    {item.title}
                  </Text>
                  <Text fontSize="sm" color="gray.400">
                    {item.mediaType === "movie" ? "Movie" : "TV Show"}
                  </Text>
                </Box>
              </Box>
            ))}
          </Grid>
        ) : (
          <Box p={8} textAlign="center" borderRadius="md" bg="gray.700">
            <Text mb={4}>This watchlist is empty</Text>
            <Button colorScheme="red" onClick={() => navigate("/movies")}>
              Browse Movies
            </Button>
          </Box>
        )}
      </Container>
    </>
  );
};

export default WatchlistDetail;
