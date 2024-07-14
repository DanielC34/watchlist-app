import { Button, Input } from '@chakra-ui/react'
import { FaSearch } from "react-icons/fa";
import React from 'react'

const History = () => {
  return (
    <div className="flex flex-col space-y-7 px-4">
      <div className="flex justify-between items-center">
        <h2 className="font-bold">History</h2>
        <Button colorScheme="red" variant="solid">
          Clear History
        </Button>
      </div>
      <div className="flex space-x-2">
        <Input placeholder="Search Movie/TV Show..." className="bg-gray-700" />
        <Button colorScheme="red">
          <FaSearch />
        </Button>
      </div>
    </div>
  );
}

export default History