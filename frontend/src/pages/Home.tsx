
import {
  Box,
  Flex,
  Select,
  Button,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useState, useEffect, useCallback, ChangeEvent } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import Loading from "../components/Loading";
import { Movie } from "../types";
import ActivityFeed from "../components/ActivityFeed";

const API_KEY = import.meta.env.VITE_MOVIEDB_API_KEY;
const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL;
const IMAGE_BASE_URL =
  import.meta.env.VITE_TMDB_IMAGE_BASE_URL || "https://image.tmdb.org/t/p/w500";
const ITEMS_PER_PAGE = parseInt(import.meta.env.VITE_ITEMS_PER_PAGE) || 30;

const validateUrl = (url: string, allowedHosts: string[]): boolean => {
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

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  params: {
    api_key: API_KEY,
  },
});

const Home = () => {
  const [trending, setTrending] = useState<Movie[]>([]);
  const [timeframe, setTimeframe] = useState<string>("day");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  const location = useLocation();
  const toast = useToast();

  useEffect(() => {
    if (location.state?.toast) {
      toast(location.state.toast);
    }
  }, [location, toast]);

  const fetchTrending = useCallback(
    async (timeframe: string, page: number) => {
      try {
        setLoading(true);

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

  const handleTimeframeChange = (e: ChangeEvent<HTMLSelectElement>) => {
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

  const getImageUrl = (path: string): string | null => {
    return path ? `${IMAGE_BASE_URL}${path}` : null;
  };

  return (
    <>
      <ActivityFeed />
      <Box mb={6}>
        <Flex justify="space-between" align="center" mb={4}>
          <h2 className="text-2xl font-bold text-gray-100">Trending</h2>
          <Select
            value={timeframe}
            onChange={handleTimeframeChange}
            size="sm"
            w="auto"
            bg="gray.900"
            borderColor="gray.700"
            _hover={{ borderColor: "gray.600" }}
          >
            <option value="day">Today</option>
            <option value="week">This Week</option>
          </Select>
        </Flex>
      </Box>

      {loading ? (
        <Loading />
      ) : trending.length > 0 ? (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-3">
          {trending.map((item) => (
            <Link
              to={`/${item.media_type}/${item.id}`}
              key={item.id}
              className="group"
            >
              <div className="relative aspect-[2/3] overflow-hidden rounded-md bg-gray-900 shadow-lg transition-transform duration-200 group-hover:scale-105 group-hover:shadow-xl">
                {item.poster_path ? (
                  <img
                    src={getImageUrl(item.poster_path)!}
                    alt={item.title || item.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                    <p className="text-xs text-gray-500 text-center px-2">No Image</p>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              </div>
              <h3 className="text-xs font-medium mt-2 line-clamp-2 text-gray-300">
                {item.title || item.name}
              </h3>
            </Link>
          ))}
        </div>
      ) : (
        <Box textAlign="center" py={12}>
          <Text color="gray.500">No content found</Text>
        </Box>
      )}

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
        <Text fontSize="sm" color="gray.400">
          {currentPage} / {totalPages}
        </Text>
        <Button
          onClick={nextPage}
          isDisabled={trending.length < ITEMS_PER_PAGE || currentPage === totalPages}
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

export default Home;
