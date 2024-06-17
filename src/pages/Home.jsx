import { Container, Flex, Heading } from '@chakra-ui/react'
import React from 'react'
import ToggleSwitch from '../components/ToggleSwitch';

const Home = () => {
  return (
    <Container maxW={"container.xl"}>
      <Flex alignItems={"baseline"} gap={"4"} my={"10"}>
        <Heading as="h2" fontSize={"md"} textTransform={"uppercase"}>
          Trending
        </Heading>
        <ToggleSwitch />
      </Flex>
    </Container>
  );
}

export default Home