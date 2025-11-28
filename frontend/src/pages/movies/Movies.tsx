import { useState, useEffect, ChangeEvent } from "react";
import { Flex, Button, Select } from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_KEY = import.meta.env.VITE_MOVIEDB_API_KEY;
const BASE_MOVIE_URL = "https://api.themoviedb.org/3";
const ITEMS_PER_PAGE = 30; // Number of items per page
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
      // Validate category to prevent SSRF
      const allowedCategories: MovieCategory[] = [
        "popular",
        "top_rated",
        "upcoming",
        "now_playing",
      ];
      if (!allowedCategories.includes(selectedCategory)) {
        throw new Error("Invalid category parameter");
      }
      
      // Validate page parameter to prevent SSRF
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
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleCardClick = (id: number) => {
    navigate(`/movie/${id}`);
  };

  return (
    <>
      <Flex justify="space-between" align="center" mb={6} flexWrap="wrap" gap={4}>
        <h2 className="text-2xl font-bold text-gray-100">Movies</h2>
        <Flex align="center" gap={3}>
          <span className="text-sm text-gray-400 hidden md:inline">Category:</span>
          <Select
            value={category}
            onChange={handleCategoryChange}
            size="md"
            w={{ base: "auto", md: "200px" }}
            bg="gray.900"
            borderColor="gray.700"
            _hover={{ borderColor: "gray.600" }}
          >
            <option value="popular">Popular</option>
            <option value="top_rated">Top Rated</option>
            <option value="upcoming">Upcoming</option>
            <option value="now_playing">Now Playing</option>
          </Select>
        </Flex>
      </Flex>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-3">
        {movies.map((movie) => (
          <div
            key={movie.id}
            className="group cursor-pointer"
            onClick={() => handleCardClick(movie.id)}
          >
            <div className="relative aspect-[2/3] overflow-hidden rounded-md bg-gray-900 shadow-lg transition-transform duration-200 group-hover:scale-105 group-hover:shadow-xl">
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path ?? ""}`}
                alt={movie.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            </div>
            <h3 className="text-xs font-medium mt-2 line-clamp-2 text-gray-300">
              {movie.title}
            </h3>
          </div>
        ))}
      </div>

      <Flex justifyContent="center" align="center" mt={8} gap={4}>
        <Button
          onClick={prevPage}
          isDisabled={currentPage === 1}
          size="sm"
          variant="outline"
          colorScheme="gray"
        >
          Previous
        </Button>
        <p className="text-sm text-gray-400">
          {currentPage} / {totalPages}
        </p>
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
    </>
  );
};

export default Movies;
