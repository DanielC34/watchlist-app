
import {
  Container,
  Flex,
  FormLabel,
  FormControl,
  Select,
  Button,
  Heading,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import Loading from "../components/Loading.jsx";

const API_KEY = import.meta.env.VITE_MOVIEDB_API_KEY;
console.log("API Key loaded:", API_KEY ? "Yes" : "No");
const BASE_URL = "https://api.themoviedb.org/3";
const ITEMS_PER_PAGE = 30; // Number of items per page

const Home = () => {
  const [trending, setTrending] = useState([]); //stores data for trending movies/tv shows
  const [timeframe, setTimeframe] = useState("day"); //Stores the selected time frame ('day' for today, 'week' for this week).
  const [currentPage, setCurrentPage] = useState(1); // Current page number
  const [totalPages, setTotalPages] = useState(0); // Total number of pages
  const [loading, setLoading] = useState(true);

  const location = useLocation(); // Get the current location to check for state
  const toast = useToast();

  // Check if there is a state passed from the previous page
  useEffect(() => {
    if (location.state?.toast) {
      toast(location.state.toast);
    }
  }, [location, toast]);

  useEffect(() => {
    fetchTrending(timeframe, currentPage);
  }, [timeframe, currentPage]);

  // Function to fetch trending data from TMDb API
  const fetchTrending = async (timeframe, page) => {
    try {
      setLoading(true); //Sets loading to true while TV show data is being fetched

      console.log(
        `Fetching trending data: ${BASE_URL}/trending/all/${timeframe}?api_key=XXX&page=${page}`
      );

      const response = await axios.get(
        `${BASE_URL}/trending/all/${timeframe}?api_key=${API_KEY}&page=${page}`
      );
      if (response.data && response.data.results) {
        setTrending(response.data.results);
        // Calculate total pages based on the total number of items and items per page
        const totalItems = response.data.total_results;
        const totalPagesCount = Math.ceil(totalItems / ITEMS_PER_PAGE);
        setTotalPages(totalPagesCount);
      } else {
        console.error("Invalid API response format:", response.data);
        setTrending([]);
      }

      setLoading(false);
    } catch (error) {
      console.error(
        "Error fetching trending data for trending movies & tv shows:",
        error.response ? error.response.data : error.message
      );
      setLoading(false);
      setTrending([]);
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
      <Container maxW="container.xl" px={{ base: 2, md: 4 }}>
        <Heading size={{ base: "lg", md: "xl" }}>Home</Heading>
        <Flex
          alignItems="center"
          justifyContent="center"
          my={{ base: 5, md: 10 }}
        >
          <FormControl>
            <FormLabel fontSize={{ base: "sm", md: "md" }}>
              Find out what is trending
            </FormLabel>
            <Select
              w={{ base: "100%", md: "200px" }}
              value={timeframe}
              onChange={handleTimeframeChange}
              size={{ base: "sm", md: "md" }}
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
      ) : trending.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-4">
          {trending.map((item) => (
            <Link
              to={`/details/${item.id}`}
              state={{ type: item.media_type }}
              key={item.id}
              className="flex justify-center"
            >
              <div
                className="movie-card border rounded-lg shadow-lg p-2"
                style={{ maxWidth: "100%" }}
              >
                {item.poster_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                    alt={item.title || item.name}
                    className="w-full h-auto rounded-md"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-700 flex items-center justify-center rounded-md">
                    <p className="text-center">No Image</p>
                  </div>
                )}
                <h3 className="text-sm sm:text-lg font-semibold mt-2 truncate">
                  {item.title || item.name}
                </h3>
                <p className="text-xs sm:text-sm">
                  {item.release_date || item.first_air_date || "Unknown date"}
                </p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center p-8">
          <p>No movies or shows found. Please try a different selection.</p>
        </div>
      )}

      {/* Pagination controls */}
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
          disabled={
            trending.length < ITEMS_PER_PAGE || currentPage === totalPages
          }
          ml={{ base: 1, md: 2 }}
          size={{ base: "sm", md: "md" }}
        >
          Next
        </Button>
      </Flex>
    </>
  );
};

export default Home;
