import { Button, Input, Spinner, Container, Flex } from "@chakra-ui/react";
import { FaSearch } from "react-icons/fa";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_KEY = import.meta.env.VITE_MOVIEDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3/search/multi";

const History = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (searchTerm.length > 0) {
      const fetchData = async () => {
        setLoading(true);
        try {
          const response = await axios.get(
            `${BASE_URL}?api_key=${API_KEY}&query=${searchTerm}`
          );
          setSearchResults(response.data.results);
        } catch (error) {
          console.error("Error fetching search results:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    } else {
      setSearchResults([]);
    }
  }, [searchTerm]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleResultClick = (id, mediaType) => {
    navigate(`/details/${id}`, { state: { type: mediaType } });
  };

  return (
    <div className="flex flex-col space-y-4 sm:space-y-7 px-2 sm:px-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
        <h2 className="font-bold text-lg sm:text-xl">Search</h2>
        <Button
          colorScheme="red"
          variant="solid"
          size={{ base: "sm", md: "md" }}
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
                onClick={() => handleResultClick(result.id, result.media_type)}
              >
                <img
                  src={`https://image.tmdb.org/t/p/w500${result.poster_path}`}
                  alt={result.title || result.name}
                  className="w-full h-auto rounded-md"
                />
                <h3 className="text-sm sm:text-lg font-semibold mt-2 truncate">
                  {result.title || result.name}
                </h3>
                <p className="text-xs sm:text-sm">
                  {result.release_date || result.first_air_date}
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
