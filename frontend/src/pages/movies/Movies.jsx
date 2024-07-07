import React from "react";
import {
  Container,
  Flex,
  FormControl,
  FormLabel,
  Select,
} from "@chakra-ui/react";

const Movies = () => {
  return (
    <div>
      <h2 className="font-bold text-xl">Trending Movies</h2>
      <Container maxW="container.xl">
        <Flex alignItems="baseline" gap="4" my="10">
          {/* <Heading as="h2" fontSize="md" textTransform="uppercase">
            Discover new Movies
          </Heading> */}
          <FormControl>
            <FormLabel>Discover new Movies</FormLabel>
            <Select w="200px">
              <option>Popular</option>
              <option>Top Rated</option>
            </Select>
          </FormControl>
        </Flex>
      </Container>
      {/*List of movies from API comes here */}
    </div>
  );
};

export default Movies;
