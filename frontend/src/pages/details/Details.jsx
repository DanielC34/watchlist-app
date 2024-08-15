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

const API_KEY = import.meta.env.VITE_MOVIEDB_API_KEY;
const BASE_MOVIE_URL = "https://api.themoviedb.org/3/movie";
const BASE_TV_URL = "https://api.themoviedb.org/3/tv";

const Details = () => {
  const { id } = useParams(); // Get the ID from the URL
  const navigate = useNavigate(); // Use useNavigate instead of useHistory
  const { state } = useLocation(); // Provide a default empty object
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);

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
    <Container maxW="container.lg" my="8">
      <Button onClick={() => navigate(-1)} colorScheme="red" mb="4">
        Back
      </Button>
      <Flex direction={{ base: "column", md: "row" }} gap="8">
        <Box flexShrink="0">
          <Image
            src={`https://image.tmdb.org/t/p/w500${details.poster_path}`}
            alt={details.title || details.name}
            borderRadius="md"
          />
        </Box>
        <Box>
          <Heading as="h1" size="xl" mb="4">
            {details.title || details.name}
          </Heading>
          <Text fontSize="lg" mb="4">
            {details.overview}
          </Text>
          <Text>
            <strong>Release Date:</strong>{" "}
            {details.release_date || details.first_air_date}
          </Text>
          <Text>
            <strong>Rating:</strong> {details.vote_average}
          </Text>
          <Text>
            <strong>Genres:</strong>{" "}
            {details.genres.map((genre) => genre.name).join(", ")}
          </Text>
        </Box>
      </Flex>
    </Container>
  );
};

export default Details;
