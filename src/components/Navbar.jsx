import { Box, Container, Flex } from '@chakra-ui/react'
import React from 'react'
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
      <Box py="4" mb="2">
        <Container maxW={"container.xl"}>
          <Flex>
            <Link>
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
                    
                    { /*DESKTOP */}

                    {/*Mobile */}
          </Flex>
        </Container>
      </Box>
    );
}

export default Navbar