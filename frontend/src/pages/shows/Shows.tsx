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
const BASE_SHOW_URL = "https://api.themoviedb.org/3";
const ITEMS_PER_PAGE = 30; // Number of items per page

const Shows = () => {
  const [shows, setShows] = useState([]);
  const [category, setCategory] = useState("popular");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const navigate = useNavigate();

  const fetchShows = async (category, page) => {
    try {
      const response = await axios.get(
        `${BASE_SHOW_URL}/tv/${category}?api_key=${API_KEY}&page=${page}`
      );
      setShows(response.data.results);
      const totalItems = response.data.total_results;
      const totalPagesCount = Math.ceil(totalItems / ITEMS_PER_PAGE);
      setTotalPages(totalPagesCount);
    } catch (error) {
      console.error(`Error fetching ${category} tv shows:`, error);
    }
  };

  useEffect(() => {
    fetchShows(category, currentPage);
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
    navigate(`/tv/${id}`);
  };

  return (
    <>
      <Flex justify="space-between" align="center" mb={6} flexWrap="wrap" gap={4}>
        <h2 className="text-2xl font-bold text-gray-100">TV Shows</h2>
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
            <option value="airing_today">Airing Today</option>
            <option value="on_the_air">On The Air</option>
          </Select>
        </Flex>
      </Flex>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-3">
        {shows.map((show) => (
          <div
            key={show.id}
            className="group cursor-pointer"
            onClick={() => handleCardClick(show.id)}
          >
            <div className="relative aspect-[2/3] overflow-hidden rounded-md bg-gray-900 shadow-lg transition-transform duration-200 group-hover:scale-105 group-hover:shadow-xl">
              <img
                src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
                alt={show.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            </div>
            <h3 className="text-xs font-medium mt-2 line-clamp-2 text-gray-300">
              {show.name}
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

export default Shows;
