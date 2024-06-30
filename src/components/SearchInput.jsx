import React from "react";
import { Input, Button } from "@chakra-ui/react";
import { FaSearch } from "react-icons/fa";

const SearchInput = () => {
  return (
    <div className="flex space-x-2">
      <Input placeholder="Search" className="bg-gray-700" />
      <Button colorScheme="red">
        <FaSearch />
      </Button>
    </div>
  );
};

export default SearchInput;
