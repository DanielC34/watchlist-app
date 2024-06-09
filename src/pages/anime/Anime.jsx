import { Container, Flex, Heading } from '@chakra-ui/react';
import React from 'react'

const Anime = () => {
  return (
    <Container maxW={"container.xl"}>
      <Flex alignItems={"baseline"} gap={"4"} my={"10"}>
        <Heading as="h2" fontSize={"md"} textTransform={"uppercase"}>
          Find new anime
        </Heading>
      </Flex>
    </Container>
  );
}

export default Anime