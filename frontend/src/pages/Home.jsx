import {
  Container,
  Flex,
  FormLabel,
  FormControl,
  Select,
  Button,
  Heading,
  useToast,
} from "@chakra-ui/react";
import { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import Loading from "../components/Loading.jsx";

// Environment variables
const API_KEY = import.meta.env.VITE_MOVIEDB_API_KEY;
const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL;
const IMAGE_BASE_URL =
  import.meta.env.VITE_TMDB_IMAGE_BASE_URL || "https://image.tmdb.org/t/p/w500";
const ITEMS_PER_PAGE = parseInt(import.meta.env.VITE_ITEMS_PER_PAGE) || 30;

// Validate URLs to prevent SSRF attacks
const validateUrl = (url, allowedHosts) => {
  try {
    const urlObj = new URL(url);
    return allowedHosts.includes(urlObj.hostname);
  } catch {
    return false;
  }
};

if (!validateUrl(BASE_URL, ['api.themoviedb.org'])) {
  throw new Error('Invalid TMDB API URL - potential SSRF attack');
}

if (!validateUrl(IMAGE_BASE_URL, ['image.tmdb.org'])) {
  throw new Error('Invalid TMDB Image URL - potential SSRF attack');
}

// Create axios instance with defaults
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  params: {
    api_key: API_KEY,
  },
});

const Home = () => {
  const [trending, setTrending] = useState([]);
  const [timeframe, setTimeframe] = useState("day");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const toast = useToast();

  useEffect(() => {
    if (location.state?.toast) {
      toast(location.state.toast);
    }
  }, [location, toast]);

  const fetchTrending = useCallback(
    async (timeframe, page) => {
      try {
        setLoading(true);

        // Validate timeframe to prevent SSRF
        const allowedTimeframes = ['day', 'week'];
        if (!allowedTimeframes.includes(timeframe)) {
          throw new Error('Invalid timeframe parameter');
        }

        const response = await api.get(`/trending/all/${timeframe}`, {
          params: { page },
        });

        if (response.data?.results) {
          setTrending(response.data.results);
          const totalItems = response.data.total_results;
          const totalPagesCount = Math.ceil(totalItems / ITEMS_PER_PAGE);
          setTotalPages(totalPagesCount);
        } else {
          throw new Error("Invalid API response format");
        }
      } catch (error) {
        toast({
          title: "Error",
          description:
            "Failed to fetch trending items. Please try again later.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        setTrending([]);
      } finally {
        setLoading(false);
      }
    },
    [toast]
  );

  useEffect(() => {
    fetchTrending(timeframe, currentPage);
  }, [timeframe, currentPage, fetchTrending]);

  const handleTimeframeChange = (e) => {
    setTimeframe(e.target.value);
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

  const getImageUrl = (path) => {
    return path ? `${IMAGE_BASE_URL}${path}` : null;
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
              to={`/${item.media_type}/${item.id}`}
              key={item.id}
              className="flex justify-center"
            >
              <div
                className="movie-card border rounded-lg shadow-lg p-2"
                style={{ maxWidth: "100%" }}
              >
                {item.poster_path ? (
                  <img
                    src={getImageUrl(item.poster_path)}
                    alt={item.title || item.name}
                    className="w-full h-auto rounded-md"
                    loading="lazy"
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
