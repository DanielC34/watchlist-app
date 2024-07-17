import { Container, Flex, FormLabel, FormControl, Select, Button } from '@chakra-ui/react'
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import axios from 'axios';
import Loading from "../components/Loading.jsx";


const API_KEY = import.meta.env.VITE_MOVIEDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";
const ITEMS_PER_PAGE = 30; // Number of items per page

const Home = () => {
  const [trending, setTrending] = useState([]); //stores data for trending movies/tv shows
  const [timeframe, setTimeframe] = useState("day"); //Stores the selected time frame ('day' for today, 'week' for this week).
  const [currentPage, setCurrentPage] = useState(1); // Current page number
  const [totalPages, setTotalPages] = useState(0); // Total number of pages
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrending(timeframe, currentPage);
  }, [timeframe, currentPage]);

  // Function to fetch trending data from TMDb API
  const fetchTrending = async (timeframe, page) => {
    try {
      setLoading(true); //Sets loading to true while TV show data is being fetched
      const response = await axios.get(
        `${BASE_URL}/trending/all/${timeframe}?api_key=${API_KEY}&page=${page}`
      );
      setTrending(response.data.results);
      // Calculate total pages based on the total number of items and items per page
      const totalItems = response.data.total_results;
      const totalPagesCount = Math.ceil(totalItems / ITEMS_PER_PAGE);
      setTotalPages(totalPagesCount);
      setLoading(false);
    } catch (error) {
      console.error(
        "Error fetching trending data for trending movies & tv shows:",
        error
      );
      setLoading(false);
    } 
  };

  // Function to handle timeframe selection change
  const handleTimeframeChange = (e) => {
    setTimeframe(e.target.value); // Update timeframe state based on selection
    setCurrentPage(1); // Reset to first page when timeframe changes
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
      <Container maxW="container.xl">
        <Flex alignItems="baseline" gap="4" my="10">
          <FormControl>
            <FormLabel>Find out what is trending</FormLabel>
            <Select
              w="200px"
              value={timeframe}
              onChange={handleTimeframeChange}
            >
              <option value="day">Today</option>
              <option value="week">This Week</option>
            </Select>
          </FormControl>
        </Flex>
      </Container>

      {/* Display fetched trending data as cards */}

      {loading ? (
        <Loading />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {trending.map((item) => (
            <Link to={`/details/${item.id}`} key={item.id}>
              <div className="movie-card border rounded-lg shadow-lg p-2">
                <img
                  src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                  alt={item.title || item.name}
                  className="w-full h-auto rounded-md"
                />
                <h3 className="text-lg font-semibold mt-2">
                  {item.title || item.name}
                </h3>
                <p className="text-sm">
                  {item.release_date || item.first_air_date}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination controls */}
      <Flex justifyContent="center" my="4">
        <Button onClick={prevPage} disabled={currentPage === 1} mr="2">
          Previous
        </Button>
        <p>
          Page {currentPage} of {totalPages}
        </p>
        <Button
          onClick={nextPage}
          disabled={
            trending.length < ITEMS_PER_PAGE || currentPage === totalPages
          }
          ml="2"
        >
          Next
        </Button>
      </Flex>
    </>
  );
}

export default Home