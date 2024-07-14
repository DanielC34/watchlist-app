import React from "react";
import { Box, Skeleton, SkeletonText } from "@chakra-ui/react";

const ITEMS_PER_PAGE = 30; // Adjust this number to match the items per page in your Movies and Shows components

const Loading = () => {
  // Create an array of numbers to map over for multiple skeletons
  const skeletonArray = Array.from(
    { length: ITEMS_PER_PAGE },
    (_, index) => index
  );

    return (
      // Display skeleton items in a responsive grid layout
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {skeletonArray.map((index) => (
          <Box
            key={index}
            padding="6"
            boxShadow="lg"
            bg="bg-gray-900"
            className="movie-card border rounded-lg shadow-lg p-2"
          >
            {/* Skeleton loading effect for an image */}
            <Skeleton height="300px" />
            {/* Skeleton loading effect for text content */}
            <SkeletonText mt="4" noOfLines={3} spacing="4" />
          </Box>
        ))}
      </div>
    );
};

export default Loading;
