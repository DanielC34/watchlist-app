import { useState, useEffect, ChangeEvent } from "react";
import { Flex, Button, Select, Heading, Text, Box, Container } from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import MovieCard from "../../components/MovieCard";
import MovieGrid from "../../components/MovieGrid";

const API_KEY = import.meta.env.VITE_MOVIEDB_API_KEY;
const BASE_MOVIE_URL = "https://api.themoviedb.org/3";
const ITEMS_PER_PAGE = 30;
type MovieCategory = "popular" | "top_rated" | "upcoming" | "now_playing";

interface MovieSummary {
  id: number;
  title: string;
  poster_path: string | null;
}

// Validate BASE_MOVIE_URL to prevent SSRF attacks
const validateUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname === "api.themoviedb.org";
  } catch {
    return false;
  }
};

if (!validateUrl(BASE_MOVIE_URL)) {
  throw new Error("Invalid TMDB API URL - potential SSRF attack");
}

const Movies = () => {
  const [movies, setMovies] = useState<MovieSummary[]>([]);
  const [category, setCategory] = useState<MovieCategory>("popular");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const navigate = useNavigate();

  const fetchMovies = async (selectedCategory: MovieCategory, page: number) => {
    try {
      const allowedCategories: MovieCategory[] = [
        "popular",
        "top_rated",
        "upcoming",
        "now_playing",
      ];
      if (!allowedCategories.includes(selectedCategory)) {
        throw new Error("Invalid category parameter");
      }

      if (!Number.isInteger(page) || page < 1 || page > 1000) {
        throw new Error("Invalid page parameter");
      }

      const response = await axios.get(
        `${BASE_MOVIE_URL}/movie/${selectedCategory}?api_key=${API_KEY}&page=${page}`
      );
      const results: MovieSummary[] = response.data.results;
      setMovies(results);
      const totalItems: number = response.data.total_results;
      const totalPagesCount = Math.ceil(totalItems / ITEMS_PER_PAGE);
      setTotalPages(totalPagesCount);
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  useEffect(() => {
    fetchMovies(category, currentPage);
  }, [category, currentPage]);

  const handleCategoryChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value as MovieCategory);
    setCurrentPage(1);
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleCardClick = (id: number) => {
    navigate(`/movie/${id}`);
  };

  return (
    <Container maxW="full" p={0}>
      <Flex justify="space-between" align="center" mb={8} flexWrap="wrap" gap={4}>
        <Box>
          <Heading as="h2" size="lg" mb={1}>Movies</Heading>
          <Text color="gray.400" fontSize="sm">Browse movies by category</Text>
        </Box>

        <Flex align="center" gap={3}>
          <Text fontSize="sm" color="gray.400" display={{ base: "none", md: "block" }}>Category:</Text>
          <Select
            value={category}
            onChange={handleCategoryChange}
            size="md"
            w={{ base: "150px", md: "200px" }}
            variant="filled"
            bg="dark.card"
            _hover={{ bg: "whiteAlpha.100" }}
            _focus={{ bg: "dark.card", borderColor: "brand.500" }}
          >
            <option value="popular">Popular</option>
            <option value="top_rated">Top Rated</option>
            <option value="upcoming">Upcoming</option>
            <option value="now_playing">Now Playing</option>
          </Select>
        </Flex>
      </Flex>

      <MovieGrid>
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            id={movie.id}
            title={movie.title}
            posterPath={movie.poster_path}
            onClick={handleCardClick}
          />
        ))}
      </MovieGrid>

      <Flex justifyContent="center" align="center" mt={10} gap={4} pb={8}>
        <Button
          onClick={prevPage}
          isDisabled={currentPage === 1}
          size="sm"
          variant="outline"
          colorScheme="gray"
        >
          Previous
        </Button>
        <Text fontSize="sm" color="gray.400">
          Page {currentPage} of {totalPages || 1}
        </Text>
        <Button
          onClick={nextPage}
          isDisabled={currentPage === totalPages}
          size="sm"
          variant="outline"
          colorScheme="gray"
        >
          Next
        </Button>
      </Flex>
    </Container>
  );
};

export default Movies;
