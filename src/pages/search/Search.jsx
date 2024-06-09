import { Container, Flex, Heading } from '@chakra-ui/react';
import React from 'react'

const Search = () => {
  return (
    <div>
      <Container maxW={"container.xl"}>
        <Flex alignItems={"baseline"} gap={"4"} my={"10"}>
          <Heading as="h2" fontSize={"md"} textTransform={"uppercase"}>
            Find what fits you
          </Heading>
        </Flex>
      </Container>
    </div>
  );
}

export default Search