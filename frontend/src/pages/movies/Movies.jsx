import React, { useState, useEffect } from "react";
import {
  Container,
  Flex,
  FormControl,
  FormLabel,
  Button,
  Select,
} from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_KEY = import.meta.env.VITE_MOVIEDB_API_KEY;
const BASE_MOVIE_URL = "https://api.themoviedb.org/3";
const ITEMS_PER_PAGE = 30; // Number of items per page

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [category, setCategory] = useState("popular");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const navigate = useNavigate();

  const fetchMovies = async (category, page) => {
    try {
      const response = await axios.get(
        `${BASE_MOVIE_URL}/movie/${category}?api_key=${API_KEY}&page=${page}`
      );
      setMovies(response.data.results);
      const totalItems = response.data.total_results;
      const totalPagesCount = Math.ceil(totalItems / ITEMS_PER_PAGE);
      setTotalPages(totalPagesCount);
    } catch (error) {
      console.error(`Error fetching ${category} movies:`, error);
    }
  };

  useEffect(() => {
    fetchMovies(category, currentPage);
  }, [category, currentPage]);

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
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

  const handleCardClick = (id) => {
    navigate(`/details/${id}`, { state: { type: "movie" } });
  };

  return (
    <>
      <h2 className="font-bold text-xl mb-2">Trending Movies</h2>
      <Container maxW={"container.xl"} px={{ base: 2, md: 4 }}>
        <Flex alignItems={"baseline"} gap={"4"} my={{ base: 5, md: 10 }}>
          <FormControl>
            <FormLabel fontSize={{ base: "sm", md: "md" }}>
              Discover new Movies
            </FormLabel>
            <Select
              w={{ base: "100%", md: "200px" }}
              value={category}
              onChange={handleCategoryChange}
              size={{ base: "sm", md: "md" }}
            >
              <option value="popular">Popular</option>
              <option value="top_rated">Top Rated</option>
              <option value="upcoming">Upcoming</option>
              <option value="now_playing">Now Playing</option>
            </Select>
          </FormControl>
        </Flex>
      </Container>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-4">
        {movies.map((movie) => (
          <div
            key={movie.id}
            className="movie-card border rounded-lg shadow-lg p-2 cursor-pointer"
            onClick={() => handleCardClick(movie.id)}
          >
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="w-full h-auto rounded-md"
            />
            <h3 className="text-sm sm:text-lg font-semibold mt-2 truncate">
              {movie.title}
            </h3>
            <p className="text-xs sm:text-sm">{movie.release_date}</p>
          </div>
        ))}
      </div>

      <Flex justifyContent="center" my="4" flexWrap="wrap" gap="2">
        <Button
          onClick={prevPage}
          disabled={currentPage === 1}
          mr={{ base: 1, md: 2 }}
          size={{ base: "sm", md: "md" }}
        >
          Previous
        </Button>
        <p className="flex items-center text-sm sm:text-md">
          Page {currentPage} of {totalPages}
        </p>
        <Button
          onClick={nextPage}
          disabled={currentPage === totalPages}
          ml={{ base: 1, md: 2 }}
          size={{ base: "sm", md: "md" }}
        >
          Next
        </Button>
      </Flex>
    </>
  );
};

export default Movies;
