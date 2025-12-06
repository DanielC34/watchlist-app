import { SimpleGrid, Box } from "@chakra-ui/react";
import { ReactNode } from "react";

interface MovieGridProps {
    children: ReactNode;
}

const MovieGrid = ({ children }: MovieGridProps) => {
    return (
        <Box w="100%">
            <SimpleGrid
                columns={{ base: 3, sm: 4, md: 5, lg: 6, xl: 7 }}
                spacing={{ base: 3, md: 4, lg: 5 }}
            >
                {children}
            </SimpleGrid>
        </Box>
    );
};

export default MovieGrid;
