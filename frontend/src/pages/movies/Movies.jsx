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
      <h2 className="font-bold text-xl">Trending Movies</h2>
      <Container maxW={"container.xl"}>
        <Flex alignItems={"baseline"} gap={"4"} my={"10"}>
          <FormControl>
            <FormLabel>Discover new Movies</FormLabel>
            <Select w="200px" value={category} onChange={handleCategoryChange}>
              <option value="popular">Popular</option>
              <option value="top_rated">Top Rated</option>
              <option value="upcoming">Upcoming</option>
              <option value="now_playing">Now Playing</option>
            </Select>
          </FormControl>
        </Flex>
      </Container>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
            <h3 className="text-lg font-semibold mt-2">{movie.title}</h3>
            <p className="text-sm">{movie.release_date}</p>
          </div>
        ))}
      </div>

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
