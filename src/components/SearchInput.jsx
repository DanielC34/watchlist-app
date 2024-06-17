import React from "react";
import { Center, Input, Box } from "@chakra-ui/react";

const SearchInput = () => {
  return (
      <Box>
        <Center
          h="100px"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Input placeholder="Search movies, TV Shows..." />
        </Center>
      </Box>
  );
};

export default SearchInput;
