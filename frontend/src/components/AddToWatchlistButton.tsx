import { useState, useMemo } from "react";
import { Button, HStack, useToast } from "@chakra-ui/react";
import { FaPlus, FaTrash } from "react-icons/fa";
import useAuthStore from "../store/useAuthStore";
import AddItemToWatchlistModal from "../pages/watchlist/AddItemToWatchlistModal";
import { useWatchlistStore } from "../store/useWatchlistStore";
import { Movie, Watchlist } from "../types";

interface Props {
  item: Movie;
}

const AddToWatchlistButton: React.FC<Props> = ({ item }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated } = useAuthStore();
  const { watchlist, removeItemFromWatchlist, getWatchlist, loading } = useWatchlistStore();
  const toast = useToast();

  const watchlistsWithItem = useMemo(() => {
    if (!watchlist) return [];
    return watchlist.filter(
      (wl) => wl.items && wl.items.some((i) => i.movieId === String(item.id))
    );
  }, [watchlist, item]);

  const inAllWatchlists =
    watchlist &&
    watchlist.length > 0 &&
    watchlistsWithItem.length === watchlist.length;

  const handleRemove = async (wl: Watchlist) => {
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

export default AddToWatchlistButton;
