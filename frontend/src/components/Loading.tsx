import { Box, Skeleton, SkeletonText } from "@chakra-ui/react";

const ITEMS_PER_PAGE = 30;

const Loading = () => {
  const skeletonArray = Array.from(
    { length: ITEMS_PER_PAGE },
    (_, index) => index
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {skeletonArray.map((index) => (
        <Box
          key={index}
          padding="6"
          boxShadow="lg"
          bg="bg-gray-900"
          className="movie-card border rounded-lg shadow-lg p-2"
        >
          <Skeleton height="300px" />
          <SkeletonText mt="4" noOfLines={3} spacing="4" />
        </Box>
      ))}
    </div>
  );
};

export default Loading;
