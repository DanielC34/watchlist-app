import { Container, Flex, Heading, Menu, MenuButton, MenuList, Button, MenuItem } from '@chakra-ui/react';
import React from 'react'
import { ChevronDownIcon } from "@chakra-ui/icons";

const Movies = () => {
  return (
    <Container maxW={"container.xl"}>
      <Flex alignItems={"baseline"} gap={"4"} my={"10"}>
        <Heading as="h2" fontSize={"md"} textTransform={"uppercase"}>
          Discover new Movies
        </Heading>
        <Menu>
          <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
            Popular
          </MenuButton>
          <MenuList>
            <MenuItem>Top Rated</MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    </Container>
  );
}

export default Movies