import { Container, Flex, Heading } from '@chakra-ui/react';

const Shows = () => {
  return (
    <Container maxW={"container.xl"}>
      <Flex alignItems={"baseline"} gap={"4"} my={"10"}>
        <Heading as="h2" fontSize={"md"} textTransform={"uppercase"}>
          Discover new Shows
        </Heading>
      </Flex>
    </Container>
  );
}

export default Shows