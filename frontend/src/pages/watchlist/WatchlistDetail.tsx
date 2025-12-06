import { useEffect, useState } from "react";
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
  ModalHeader,
  ModalFooter,
} from "@chakra-ui/react";
import {
  FaArrowLeft,
  FaTrash,
  FaEdit,
  FaStar,
} from "react-icons/fa";
import { useWatchlistStore } from "../../store/useWatchlistStore";
import useAuthStore from "../../store/useAuthStore";
import { WatchlistItem } from "../../types";
import StatusToggle from "../../components/StatusToggle";
import EditItemModal from "../../components/EditItemModal";

const WatchlistDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editingItem, setEditingItem] = useState<WatchlistItem | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { isAuthenticated } = useAuthStore();
  const {
    fetchWatchlistById,
    currentWatchlist,
    isLoading,
    error,
    removeItemFromWatchlist,
    deleteWatchlist,
    getWatchlist,
  } = useWatchlistStore();

  useEffect(() => {
    if (isAuthenticated && id) {
      fetchWatchlistById(id);
    }
  }, [id, isAuthenticated, fetchWatchlistById]);

  const openDeleteModal = () => setIsDeleteModalOpen(true);
  const closeDeleteModal = () => {
    if (!isDeleting) setIsDeleteModalOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (!id) return;
    setIsDeleting(true);
    try {
      const success = await deleteWatchlist(id);
      if (success) {
        await getWatchlist();
        setIsDeleting(false);
        setIsDeleteModalOpen(false);
        toast({
          title: "Watchlist deleted successfully",
          status: "success",
          duration: 2000,
          isClosable: true,
          position: "top",
        });
        navigate("/");
      } else {
        setIsDeleting(false);
      }
    } catch (error: any) {
      setIsDeleting(false);
      toast({
        title: "Error deleting watchlist",
        description: error.message || "Something went wrong.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setIsDeleteModalOpen(false);
    }
  };

  const handleEditItem = (item: WatchlistItem) => {
    setEditingItem(item);
    setIsEditModalOpen(true);
  };

  const handleRemoveItem = async (itemId: string) => {
    if (!id) return;
    const success = await removeItemFromWatchlist(id, itemId);
    if (success) {
      toast({
        title: "Item removed",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } else {
      toast({
        title: "Error removing item",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };



  const LoadingModal = () => (
    <Modal
      isOpen={isLoading}
      onClose={() => { }}
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

  const DeleteConfirmationModal = () => (
    <Modal
      isOpen={isDeleteModalOpen}
      onClose={isDeleting ? () => { } : closeDeleteModal}
      isCentered
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Delete Watchlist</ModalHeader>
        <ModalBody>
          {isDeleting ? (
            <Flex align="center" justify="center" py={4}>
              <Spinner size="lg" color="red.500" mr={3} />
              <Text>Deleting watchlist...</Text>
            </Flex>
          ) : (
            <Text>Are you sure you want to delete this watchlist?</Text>
          )}
        </ModalBody>
        <ModalFooter>
          <Button onClick={closeDeleteModal} mr={3} isDisabled={isDeleting}>
            No
          </Button>
          <Button
            colorScheme="red"
            onClick={handleConfirmDelete}
            isLoading={isDeleting}
            loadingText="Deleting"
          >
            Yes, Delete
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );

  if (error) {
    return (
      <Container maxW="container.xl" py={4}>
        <Button
          leftIcon={<FaArrowLeft />}
          onClick={() => navigate("/home")}
          mb={4}
        >
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
      <DeleteConfirmationModal />
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
              onClick={openDeleteModal}
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
            {currentWatchlist.items.map((item) => {
              return (
                <Box
                  key={item._id}
                  borderRadius="md"
                  overflow="hidden"
                  bg="gray.700"
                  position="relative"
                >
                  <Box position="absolute" top={2} right={2} zIndex={1}>
                    <IconButton
                      icon={<FaTrash />}
                      aria-label="Remove from watchlist"
                      size="sm"
                      colorScheme="red"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveItem(item._id);
                      }}
                    />
                  </Box>
                  <Box position="absolute" top={2} left={2} zIndex={1}>
                    <IconButton
                      icon={<FaEdit />}
                      aria-label="Edit item"
                      size="sm"
                      colorScheme="blue"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditItem(item);
                      }}
                    />
                  </Box>
                  {item.rating && (
                    <Box
                      position="absolute"
                      top={2}
                      right={12}
                      zIndex={1}
                      bg="rgba(0,0,0,0.7)"
                      px={2}
                      py={1}
                      borderRadius="md"
                      display="flex"
                      alignItems="center"
                    >
                      <FaStar color="#ECC94B" size={12} />
                      <Text ml={1} fontSize="xs" fontWeight="bold" color="white">
                        {item.rating}
                      </Text>
                    </Box>
                  )}
                  <Box position="absolute" bottom={2} left={2} right={2} zIndex={1}>
                    <StatusToggle
                      watchlistId={currentWatchlist._id}
                      itemId={item._id}
                      currentStatus={item.status}
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
                      {item.media_type === "movie" ? "Movie" : "TV Show"}
                    </Text>
                  </Box>
                  <Box h="40px" /> {/* Spacer for toggle */}
                </Box>
              );
            })}
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
      {editingItem && (
        <EditItemModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingItem(null);
          }}
          item={editingItem}
          watchlistId={id || ""}
        />
      )
      }
    </>
  );
};

export default WatchlistDetail;
