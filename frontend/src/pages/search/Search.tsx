import { Container, Flex, Heading } from '@chakra-ui/react';
import SearchInput from '../../components/SearchInput';

const Search = () => {
  return (
    <div>
      <Container maxW={"container.xl"}>
        <Flex alignItems={"baseline"} gap={"4"} my={"10"}>
          <Heading as="h2" fontSize={"md"} textTransform={"uppercase"}>
            Find what fits you
          </Heading>
        </Flex>
        <SearchInput />
      </Container>
    </div>
  );
};

export default Search;
