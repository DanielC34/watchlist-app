import React from "react";
import { FaPlus } from "react-icons/fa";
import { Image, Box, Badge } from "@chakra-ui/react";

const movies = [
  {
    id: 1,
    title: "Top Gun: Maverick",
    year: 2022,
    rating: 83,
    poster: "/path/to/topgun.jpg",
  },
  {
    id: 2,
    title: "Fantastic Beasts: The Secrets of Dumbledore",
    year: 2022,
    rating: 68,
    poster: "/path/to/fantasticbeasts.jpg",
  },
];

const Movies = () => {
  return (
    <div>
        Movies
    </div>
  );
};

export default Movies;
