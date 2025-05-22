import React, { useState, useEffect } from "react";
import {
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import { FaPlus, FaChevronDown } from "react-icons/fa";
import { useWatchlistStore } from "../store/useWatchlistStore";

const AddToWatchlistButton = ({ item }) => {
  const toast = useToast();
  const { watchlists, fetchWatchlists, addItemToWatchlist, isLoading } =
    useWatchlistStore();

  useEffect(() => {
    // Fetch watchlists when component mounts
    fetchWatchlists();
  }, [fetchWatchlists]);

  const handleAddToWatchlist = async (watchlistId) => {
    // Prepare item data
    const itemData = {
      movieId: item.id.toString(),
      title: item.title || item.name,
      posterPath: item.poster_path,
      mediaType: item.media_type || (item.first_air_date ? "tv" : "movie"),
      releaseDate: item.release_date || item.first_air_date,
    };

    const result = await addItemToWatchlist(watchlistId, itemData);

    if (result) {
      toast({
        title: "Added to watchlist",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } else {
      toast({
        title: "Error adding to watchlist",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (isLoading) {
    return (
      <Button isLoading colorScheme="red" leftIcon={<FaPlus />}>
        Add to Watchlist
      </Button>
    );
  }

  return (
    <Menu>
      <MenuButton
        as={Button}
        rightIcon={<FaChevronDown />}
        leftIcon={<FaPlus />}
        colorScheme="red"
      >
        Add to Watchlist
      </MenuButton>
      <MenuList>
        {watchlists.length > 0 ? (
          watchlists.map((watchlist) => (
            <MenuItem
              key={watchlist._id}
              onClick={() => handleAddToWatchlist(watchlist._id)}
            >
              {watchlist.name}
            </MenuItem>
          ))
        ) : (
          <MenuItem
            onClick={() => (window.location.href = "/create-watchlist")}
          >
            Create a watchlist first
          </MenuItem>
        )}
      </MenuList>
    </Menu>
  );
};

export default AddToWatchlistButton;
