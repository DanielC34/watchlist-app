import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types';
import { useWatchlistStore } from '../../store/useWatchlistStore';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
  Checkbox,
  VStack,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";

const AddItemToWatchlistModal = ({isOpen, onClose, item}) => {
  const [selectedWatchlistId, setSelectedWatchlistId] = useState([]);
  const toast = useToast();
  const { watchlist, getWatchlist, addItemToWatchlist, loading } =
    useWatchlistStore();

  useEffect(() => {
    if (isOpen) getWatchlist();
    if (!isOpen) setSelectedWatchlistId([]);
  }, [isOpen, getWatchlist]);

  // Helper: check if item is already in a watchlist
  const isItemInWatchlist = (wl) =>
    wl.items && wl.items.some((i) => i.movieId === String(item.id));

  const handleCheckboxChange = (watchlistId) => {
    setSelectedWatchlistId((prev) =>
      prev.includes(watchlistId)
        ? prev.filter((id) => id !== watchlistId)
        : [...prev, watchlistId]
    );
  };

  const handleAdd = async () => {
    let addedCount = 0;
    const itemData = {
      movieId: item.id?.toString(),
      title: item.title || item.name,
      posterPath: item.poster_path,
      mediaType: item.media_type || (item.first_air_date ? "tv" : "movie"),
      releaseDate: item.release_date || item.first_air_date,
    };
    for (const wlId of selectedWatchlistId) {
      await addItemToWatchlist(wlId, itemData);
      addedCount++;
    }
    await getWatchlist();
    toast({
      title: `Added to ${addedCount} watchlist${addedCount === 1 ? "" : "s"}`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Select Watchlists</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {loading ? (
            <Spinner />
          ) : watchlist && watchlist.length > 0 ? (
            <VStack align="start" spacing={3}>
              {watchlist.map((wl) => {
                const alreadyAdded = isItemInWatchlist(wl);
                return (
                  <Checkbox
                    key={wl._id}
                    isChecked={selectedWatchlistId.includes(wl._id)}
                    onChange={() => handleCheckboxChange(wl._id)}
                    isDisabled={alreadyAdded}
                  >
                    {wl.name}
                    {alreadyAdded && (
                      <Text as="span" color="gray.400" fontSize="sm" ml={2}>
                        (Already added)
                      </Text>
                    )}
                  </Checkbox>
                );
              })}
            </VStack>
          ) : (
            <Text>
              No watchlists found.{" "}
              <a href="/create-watchlist" style={{ color: "#E53E3E" }}>
                Create one?
              </a>
            </Text>
          )}
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose} mr={3}>
            Cancel
          </Button>
          <Button
            colorScheme="red"
            onClick={handleAdd}
            isDisabled={selectedWatchlistId.length === 0}
            isLoading={loading}
          >
            Add
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
AddItemToWatchlistModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  item: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    name: PropTypes.string,
    poster_path: PropTypes.string,
    media_type: PropTypes.string,
    first_air_date: PropTypes.string,
    release_date: PropTypes.string
  }).isRequired
};

export default AddItemToWatchlistModal
