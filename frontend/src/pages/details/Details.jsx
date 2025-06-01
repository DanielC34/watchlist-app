import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
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
import AddToWatchlistButton from "../../components/AddToWatchlistButton";

const API_KEY = import.meta.env.VITE_MOVIEDB_API_KEY;
const BASE_MOVIE_URL = "https://api.themoviedb.org/3/movie";
const BASE_TV_URL = "https://api.themoviedb.org/3/tv";

const Details = () => {
  // Get both the type ("movie" or "tv") and the id from the URL
  const { details, id } = useParams();
  const navigate = useNavigate();

  const [itemDetails, setItemDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        // Use the route param to determine type
        if (!details) {
          console.log("Type is not defined in route param");
          return;
        }

        const url =
          details === "movie"
            ? `${BASE_MOVIE_URL}/${id}?api_key=${API_KEY}`
            : `${BASE_TV_URL}/${id}?api_key=${API_KEY}`;
      

        const response = await axios.get(url);
        setItemDetails(response.data);
      } catch (error) {
        console.error("Error fetching details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id, details]);

  if (loading) {
    return <Spinner size="xl" />;
  }

  if (!itemDetails) {
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
            src={`https://image.tmdb.org/t/p/w500${itemDetails.poster_path}`}
            alt={itemDetails.title || itemDetails.name}
            borderRadius="md"
            w="100%"
          />
        </Box>
        <Box>
          <Heading as="h1" size={{ base: "lg", md: "xl" }} mb="4">
            {itemDetails.title || itemDetails.name}
          </Heading>
          <Text fontSize={{ base: "md", md: "lg" }} mb="4">
            {itemDetails.overview}
          </Text>
          <Text fontSize={{ base: "sm", md: "md" }}>
            <strong>Release Date:</strong>{" "}
            {itemDetails.release_date || itemDetails.first_air_date}
          </Text>
          <Text fontSize={{ base: "sm", md: "md" }}>
            <strong>Rating:</strong> {itemDetails.vote_average}
          </Text>
          <Text fontSize={{ base: "sm", md: "md" }}>
            <strong>Genres:</strong>{" "}
            {itemDetails.genres.map((genre) => genre.name).join(", ")}
          </Text>
          <div>
            <AddToWatchlistButton item={itemDetails} />
          </div>
        </Box>
      </Flex>
    </Container>
  );
};

export default Details;
