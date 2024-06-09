import { Box, Container, Flex } from '@chakra-ui/react'
import React from 'react'
import { SearchIcon } from "@chakra-ui/icons";
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
      <Box py="4" mb="2">
        <Container maxW={"container.xl"}>
          <Flex justifyContent={"space-between"}>
            <Link to="/">
              <Box
                fontSize={"2xl"}
                fontWeight={"bold"}
                color={"red"}
                letterSpacing={"widest"}
                fontFamily={"mono"}
              >
                FILMVAULT
              </Box>
            </Link>

            {/*DESKTOP */}
            <Flex
              gap="4"
              alignItems={"center"}
              display={{ base: "none", md: "flex" }}
            >
              <Link to="/">Home</Link>
              <Link to="/movies">Movies</Link>
              <Link to="/shows">TV Shows</Link>
              <Link to="/anime">Anime</Link>
              <Link to="/search">
                <SearchIcon />
              </Link>
            </Flex>

            {/*Mobile */}
          </Flex>
        </Container>
      </Box>
    );
}

export default Navbar