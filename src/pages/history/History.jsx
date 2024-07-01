import { Button } from '@chakra-ui/react'
import React from 'react'

const History = () => {
  return (
    <div className="flex justify-between items-center px-4">
      <h2 className="font-bold">History</h2>
      <Button colorScheme="red" variant="solid">
        Clear History
      </Button>
    </div>
  );
}

export default History