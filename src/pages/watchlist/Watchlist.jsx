import React from 'react'
import { Button, Input } from "@chakra-ui/react";

const Watchlist = () => {
  return (
    <div className="flex flex-col space-y-4">
      <h2 className="font-bold">Create a New Watchlist</h2>
      <div className="flex flex-col space-y-2">
        <h4>Name</h4>
        <Input placeholder="Watchlist name" />
      </div>
      <div className="flex flex-col space-y-2">
        <h4>Description</h4>
        <Input placeholder="Describe the watchlist content" size="lg" />
      </div>
      <div className="mt-auto text-center">
        <Button colorScheme="red" variant="solid">
          + Create Watchlist
        </Button>
      </div>
    </div>
  );
}

export default Watchlist