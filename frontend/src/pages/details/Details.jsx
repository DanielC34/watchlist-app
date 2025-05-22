import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  Button,
  Container,
  Spinner,
  Text,
  Heading,
  Image,
  Box,
  Flex,
} from "@chakra-ui/react";
import { useWatchlistStore } from "../../store/useWatchlistStore";
import AddToWatchlistButton from "../../components/AddToWatchlistButton";

const API_KEY = import.meta.env.VITE_MOVIEDB_API_KEY;
const BASE_MOVIE_URL = "https://api.themoviedb.org/3/movie";
const BASE_TV_URL = "https://api.themoviedb.org/3/tv";

const Details = () => {
  const { id } = useParams(); // Get the ID from the URL
  const navigate = useNavigate(); // Use useNavigate instead of useHistory
  const { state } = useLocation(); // Provide a default empty object

  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const watchlist = useWatchlistStore(state => state.watchlist); // Use useWatchlistStore hook to access watchlist state and actions
  const addItemToWatchlist = useWatchlistStore(state => state.addItemToWatchlist); // Use useWatchlistStore hook for addItemToWatchlist
  const removeItemFromWatchlist = useWatchlistStore(state => state.removeItemFromWatchlist); // Use useWatchlistStore hook for removeItemFromWatchlist
  const deleteWatchlist = useWatchlistStore(state => state.deleteWatchlist); // Use useWatchlistStore hook for deleteWatchlist
  const createWatchlist = useWatchlistStore(state => state.createWatchlist); // Use useWatchlistStore hook for createWatchlist
  const getWatchlist = useWatchlistStore(state => state.getWatchlist); // Use useWatchlistStore hook for getWatchlist
  const updateWatchlist = useWatchlistStore(state => state.updateWatchlist); // Use useWatchlistStore hook for updateWatchlist


  const [isInWatchlist, setIsInWatchlist] = useState(
   watchlist.some((item) => item.id === id)
 );

  useEffect(() => {
    // Recalculate if item is in the watchlist whenever the watchlist changes
    setIsInWatchlist(watchlist.some((item) => item.id === id));
  }, [watchlist, id]);

  useEffect(() => {
    getWatchlist(); // Fetch watchlist on mount
  }, [getWatchlist]);

  const handleWatchlistToggle = () => {

    if (!details || !details.id) {
      console.error("Details object must have an 'id' property.");
      return;
    }

    if (isInWatchlist) {
      // The item is currently in the watchlist
      removeItemFromWatchlist(id); // Remove the item from the watchlist
      setIsInWatchlist(false); // Update `isInWatchlist` to false
      console.log("Removing item from watchlist"); // Log or notify that the item has been removed from the watchlist
    } else {
      // The item is not currently in the watchlist
      addItemToWatchlist(details); // Add the item to the watchlist
      setIsInWatchlist(true);// Update `isInWatchlist` to true
      console.log("Added item to watchlist"); // Log or notify that the item has been added to the watchlist
    }
  }

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        if (!state || !state.type) {
          console.log("Type is not defined in state");
          return;
        }

        const url =
          state.type === "movie"
            ? `${BASE_MOVIE_URL}/${id}?api_key=${API_KEY}`
            : `${BASE_TV_URL}/${id}?api_key=${API_KEY}`;

        const response = await axios.get(url);
        setDetails(response.data);
      } catch (error) {
        console.error("Error fetching details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id, state]);

  if (loading) {
    return <Spinner size="xl" />;
  }

  if (!details) {
    return <Text>Details not found</Text>;
  }

  return (
    <Container
      maxW="container.lg"
      my={{ base: 4, md: 8 }}
      px={{ base: 2, md: 4 }}
    >
      <Button
        onClick={() => navigate(-1)}
        colorScheme="red"
        mb="4"
        size={{ base: "sm", md: "md" }}
      >
        Back
      </Button>
      <Flex direction={{ base: "column", md: "row" }} gap={{ base: 4, md: 8 }}>
        <Box
          flexShrink="0"
          maxW={{ base: "100%", md: "300px" }}
          mx={{ base: "auto", md: 0 }}
        >
          <Image
            src={`https://image.tmdb.org/t/p/w500${details.poster_path}`}
            alt={details.title || details.name}
            borderRadius="md"
            w="100%"
          />
        </Box>
        <Box>
          <Heading as="h1" size={{ base: "lg", md: "xl" }} mb="4">
            {details.title || details.name}
          </Heading>
          <Text fontSize={{ base: "md", md: "lg" }} mb="4">
            {details.overview}
          </Text>
          <Text fontSize={{ base: "sm", md: "md" }}>
            <strong>Release Date:</strong>{" "}
            {details.release_date || details.first_air_date}
          </Text>
          <Text fontSize={{ base: "sm", md: "md" }}>
            <strong>Rating:</strong> {details.vote_average}
          </Text>
          <Text fontSize={{ base: "sm", md: "md" }}>
            <strong>Genres:</strong>{" "}
            {details.genres.map((genre) => genre.name).join(", ")}
          </Text>
          <div>
            <Button
              colorScheme="red"
              mt="4"
              mb="4"
              onClick={handleWatchlistToggle}
              size={{ base: "sm", md: "md" }}
              width={{ base: "100%", md: "auto" }}
            >
              {isInWatchlist ? "- Remove from Watchlist" : "+ Add to Watchlist"}
            </Button>
          </div>
        </Box>
      </Flex>
    </Container>
  );
};

export default Details;
