import React from "react";
import {
  Container,
  Flex,
  FormControl,
  FormLabel,
  Select,
} from "@chakra-ui/react";

const Shows = () => {
  return (
    <div>
      <h2 className="font-bold text-xl">Trending TV Shows</h2>
      <Container maxW={"container.xl"}>
        <Flex alignItems={"baseline"} gap={"4"} my={"10"}>
          {/* <Heading as="h2" fontSize={"md"} textTransform={"uppercase"}>
          Discover new Shows
        </Heading> */}
          <FormControl>
            <FormLabel>Discover new Shows</FormLabel>
            <Select w="200px">
              <option>Popular</option>
              <option>Top Rated</option>
            </Select>
          </FormControl>
        </Flex>
      </Container>
      {/*List of TV shows from API comes here */}
    </div>
  );
};

export default Shows;
