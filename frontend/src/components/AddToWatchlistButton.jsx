import React, { useState, useMemo } from "react";
import {
  Button,
  IconButton,
  HStack,
  useToast
} from "@chakra-ui/react";
import { FaPlus, FaTrash } from "react-icons/fa";
import useAuthStore from "../store/useAuthStore";
import AddItemToWatchlistModal from "../pages/watchlist/AddItemToWatchlistModal";
import { useWatchlistStore } from "../store/useWatchlistStore";
import PropTypes from "prop-types";

const AddToWatchlistButton = ({ item }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated } = useAuthStore();
  const { watchlist, removeItemFromWatchlist, getWatchlist, loading } =
    useWatchlistStore();
  const toast = useToast();

  // Find all watchlists that contain this item
  const watchlistsWithItem = useMemo(() => {
    if (!watchlist) return [];
    return watchlist.filter(
      (wl) => wl.items && wl.items.some((i) => i.movieId === String(item.id))
    );
  }, [watchlist, item]);

  // If item is in all watchlists, disable the button
  const inAllWatchlists =
    watchlist &&
    watchlist.length > 0 &&
    watchlistsWithItem.length === watchlist.length;

  const handleRemove = async (wl) => {
    // Find the item in the watchlist
    const itemInList = wl.items.find((i) => i.movieId === String(item.id));
    if (!itemInList) return;
    await removeItemFromWatchlist(wl._id, itemInList._id);
    toast({
      title: `Removed from "${wl.name}"`,
      status: "info",
      duration: 3000,
      isClosable: true,
    });
    getWatchlist();
  };

  // Find if the item is already in any watchlist
  const found = useMemo(() => {
    if (!watchlist) return null;
    for (const wl of watchlist) {
      if (wl.items && wl.items.some((i) => i.movieId === String(item.id))) {
        return wl;
      }
    }
    return null;
  }, [watchlist, item]);

  // const handleRemove = async () => {
  //   if (!found) return;
  //   // Find the item in the found watchlist
  //   const itemInList = found.items.find((i) => i.movieId === String(item.id));
  //   if (!itemInList) return;
  //   await removeItemFromWatchlist(found._id, itemInList._id);
  //   toast({
  //     title: "Removed from watchlist",
  //     status: "info",
  //     duration: 3000,
  //     isClosable: true,
  //   });
  //   getWatchlist(); // Refresh the watchlists
  // };

  if (!isAuthenticated) return null;

  return (
    <>
      <Button
        leftIcon={<FaPlus />}
        colorScheme="red"
        onClick={() => setIsOpen(true)}
        isDisabled={inAllWatchlists}
      >
        {inAllWatchlists ? "Added to all watchlists" : "Add to Watchlist"}
      </Button>
      {/* Show which watchlists this item is in, with remove option */}
      {watchlistsWithItem.length > 0 && (
        <HStack mt={2} spacing={2}>
          {watchlistsWithItem.map((wl) => (
            <Button
              key={wl._id}
              size="sm"
              variant="outline"
              leftIcon={<FaTrash />}
              colorScheme="gray"
              onClick={() => handleRemove(wl)}
              isLoading={loading}
            >
              {wl.name}
            </Button>
          ))}
        </HStack>
      )}
      <AddItemToWatchlistModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        item={item}
      />
    </>
  );
};


AddToWatchlistButton.propTypes = {
  item: PropTypes.object.isRequired,
};

export default AddToWatchlistButton;
