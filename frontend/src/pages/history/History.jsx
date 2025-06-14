import { 
  Button, 
  Input, 
  Spinner, 
  Container, 
  useToast 
} from "@chakra-ui/react";
import { FaSearch } from "react-icons/fa";
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Environment variables
const API_KEY = import.meta.env.VITE_MOVIEDB_API_KEY;
const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL;
const IMAGE_BASE_URL = import.meta.env.VITE_TMDB_IMAGE_BASE_URL || 'https://image.tmdb.org/t/p/w500';

// Create axios instance with defaults
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  params: {
    api_key: API_KEY
  }
});

const History = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const fetchSearchResults = useCallback(async (query) => {
    if (!query) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    try {
      const response = await api.get('/search/multi', {
        params: {
          query: query.trim()
        }
      });

      if (response.data?.results) {
        setSearchResults(response.data.results);
      } else {
        throw new Error('Invalid API response format');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch search results. Please try again later.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchTerm) {
        fetchSearchResults(searchTerm);
      }
    }, 500); // Debounce search for 500ms

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, fetchSearchResults]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleResultClick = (result) => {
    if (!result.media_type || !result.id) {
      toast({
        title: "Error",
        description: "Invalid item selected",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    navigate(`/${result.media_type}/${result.id}`);
  };

  const clearHistory = () => {
    setSearchTerm("");
    setSearchResults([]);
  };

  const getImageUrl = (path) => {
    return path ? `${IMAGE_BASE_URL}${path}` : null;
  };

  return (
    <div className="flex flex-col space-y-4 sm:space-y-7 px-2 sm:px-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
        <h2 className="font-bold text-lg sm:text-xl">Search</h2>
        <Button
          colorScheme="red"
          variant="solid"
          size={{ base: "sm", md: "md" }}
          onClick={clearHistory}
        >
          Clear History
        </Button>
      </div>
      <div className="flex flex-col sm:flex-row gap-2">
        <Input
          placeholder="Search Movie/TV Show..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="bg-gray-700"
          size={{ base: "sm", md: "md" }}
        />
        <Button
          colorScheme="red"
          size={{ base: "sm", md: "md" }}
          width={{ base: "100%", sm: "auto" }}
          isDisabled={!searchTerm.trim()}
        >
          <FaSearch />
        </Button>
      </div>
      {loading ? (
        <Spinner size="xl" />
      ) : (
        <Container maxW={"container.xl"} px={{ base: 0, md: 4 }}>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-4">
            {searchResults.map((result) => (
              <div
                key={result.id}
                className="show-card border rounded-lg shadow-lg p-2 cursor-pointer"
                onClick={() => handleResultClick(result)}
              >
                {result.poster_path ? (
                  <img
                    src={getImageUrl(result.poster_path)}
                    alt={result.title || result.name}
                    className="w-full h-auto rounded-md"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-700 flex items-center justify-center rounded-md">
                    <p className="text-center">No Image</p>
                  </div>
                )}
                <h3 className="text-sm sm:text-lg font-semibold mt-2 truncate">
                  {result.title || result.name || 'Unknown Title'}
                </h3>
                <p className="text-xs sm:text-sm">
                  {result.release_date || result.first_air_date || 'Release date unknown'}
                </p>
              </div>
            ))}
          </div>
        </Container>
      )}
    </div>
  );
};

export default History;
