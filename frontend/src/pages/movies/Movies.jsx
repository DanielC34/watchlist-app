import React from "react";
import {
  Container,
  Flex,
  FormControl,
  FormLabel,
  Button,
  Select,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";

const API_KEY = import.meta.env.VITE_MOVIEDB_API_KEY;
const BASE_MOVIE_URL = "https://api.themoviedb.org/3";
const ITEMS_PER_PAGE = 30; // Number of items per page

const Movies = () => {
  const [movies, setMovies] = useState([]); //stores data for trending movies
  const [category, setCategory] = useState("popular"); //Stores the selected time frame category ('popular', 'top_rated', 'upcoming')
  const [currentPage, setCurrentPage] = useState(1); // Current page number
  const [totalPages, setTotalPages] = useState(0); // Total number of pages

  useEffect(() => {
    fetchMovies(category, currentPage);
  }, [category, currentPage]);

  // Function to fetch movies from TMDb API based on category and page
  const fetchMovies = async (category, page) => {
    try {
      const response = await axios.get(
        `${BASE_MOVIE_URL}/movie/${category}?api_key=${API_KEY}&page=${page}`
      );
      setMovies(response.data.results);
      // Calculate total pages based on the total number of items and items per page
      const totalItems = response.data.total_results;
      const totalPagesCount = Math.ceil(totalItems / ITEMS_PER_PAGE);
      setTotalPages(totalPagesCount);
    } catch (error) {
      console.error(`Error fetching ${category} movies:`, error);
    }
  };

  // Function to handle category selection change
  const handleCategoryChange = (e) => {
    setCategory(e.target.value); // Update category state based on selection
    setCurrentPage(1); // Reset to first page when category changes
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

  return (
    <>
      <h2 className="font-bold text-xl">Trending Movies</h2>
      <Container maxW="container.xl">
        <Flex alignItems="baseline" gap="4" my="10">
          {/* <Heading as="h2" fontSize="md" textTransform="uppercase">
            Discover new Movies
          </Heading> */}
          <FormControl>
            <FormLabel>Discover new Movies</FormLabel>
            <Select w="200px" value={category} onChange={handleCategoryChange}>
              <option value="popular">Popular</option>
              <option value="top_rated">Top Rated</option>
              <option value="now_playing">Now Playing</option>
            </Select>
          </FormControl>
        </Flex>
      </Container>
      {/*List of fetched movies from API comes here */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {movies.map((movie) => (
          <div
            key={movie.id}
            className="movie-card border rounded-lg shadow-lg p-2"
          >
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="w-full h-auto rounded-md"
            />
            <h3 className="text-lg font-semibold mt-2">{movie.title}</h3>
            <p className="text-sm">{movie.release_date}</p>
          </div>
        ))}
      </div>

      {/* Pagination controls */}
      <Flex justifyContent="center" my="4">
        <Button onClick={prevPage} disabled={currentPage === 1} mr="2">
          Previous
        </Button>
        <p>
          Page {currentPage} of {totalPages}
        </p>
        <Button onClick={nextPage} disabled={currentPage === totalPages} ml="2">
          Next
        </Button>
      </Flex>
    </>
  );
};

export default Movies;
