import { Container, Flex, FormLabel, FormControl,Select } from '@chakra-ui/react'
import React, { useState, useEffect } from 'react'
import axios from 'axios';

const API_KEY = import.meta.env.VITE_MOVIEDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

const Home = () => {
  const [trending, setTrending] = useState([]); //stores data for trending movies/tv shows
  const [timeframe, setTimeframe] = useState("day"); //Stores the selected time frame ('day' for today, 'week' for this week).

  // Function to fetch trending data from TMDb API
const fetchTrending = async (timeframe) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/trending/all/${timeframe}?api_key=${API_KEY}`
    );
    setTrending(response.data.results);
  } catch (error) {
    console.error("Error fetching trending data for trending movies & tv shows:", error);
  }
  };
  
    useEffect(() => {
      fetchTrending(timeframe);
    }, [timeframe]);


  return (
    <>
      <Container maxW="container.xl">
        <Flex alignItems="baseline" gap="4" my="10">
          {/* <Heading as="h2" fontSize="md" textTransform="uppercase">
            Discover new Movies
          </Heading> */}
          <FormControl>
            <FormLabel>Find out what is trending</FormLabel>
            <Select w="200px">
              <option value="day">Today</option>
              <option value="week">This Week</option>
            </Select>
          </FormControl>
        </Flex>
      </Container>
      {/* Display fetched trending data as cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {trending.map((item) => (
          <div
            key={item.id}
            className="movie-card border rounded-lg shadow-lg p-2"
          >
            <img
              src={`https://image.tmdb.org/t/p/w200${item.poster_path}`}
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
        ))}
      </div>
    </>
  );
}

export default Home