import {
  Box,
  Badge,
  Flex,
  Heading,
  Menu,
  MenuButton,
  Button,
  Container,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { FaPlus } from "react-icons/fa";
import { ChevronDownIcon } from "@chakra-ui/icons";

const Movies = () => {
  return (
    <div>
      <h2 className="font-bold text-xl">Trending Movies</h2>
      <Container maxW="container.xl">
        <Flex alignItems="baseline" gap="4" my="10">
          <Heading as="h2" fontSize="md" textTransform="uppercase">
            Discover new Movies
          </Heading>
          <Menu>
            <MenuButton
              as={Button}
              rightIcon={<ChevronDownIcon />}
              className="bg-blue-500 text-white"
            >
              Popular
            </MenuButton>
            <MenuList>
              <MenuItem className="text-gray-700">Top Rated</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Container>
    </div>
  );
};

export default Movies;
