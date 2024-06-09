import { Container, Flex, Heading } from '@chakra-ui/react'
import React from 'react'

const Home = () => {
  return (
    <Container maxW={"container.xl"}>
      <Flex alignItems={"baseline"} gap={"4"} my={"10"}>
        <Heading as="h2" fontSize={"md"} textTransform={"uppercase"}>
          Trending
        </Heading>
      </Flex>
    </Container>
  );
}

export default Home