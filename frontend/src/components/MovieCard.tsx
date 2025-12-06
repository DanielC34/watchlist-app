import { Box, Image, Text, AspectRatio, Skeleton, useColorModeValue } from "@chakra-ui/react";
import { useState } from "react";
import { motion } from "framer-motion";

interface MovieCardProps {
    id: number;
    title: string;
    posterPath: string | null;
    onClick: (id: number) => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MotionBox = motion(Box) as any;

const MovieCard = ({ id, title, posterPath, onClick }: MovieCardProps) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const borderColor = useColorModeValue("transparent", "brand.500");

    return (
        <Box
            as="article"
            position="relative"
            cursor="pointer"
            onClick={() => onClick(id)}
            role="group"
            w="100%"
        >
            <AspectRatio ratio={2 / 3} w="100%">
                <Skeleton isLoaded={isLoaded} startColor="gray.800" endColor="gray.700" borderRadius="md">
                    <MotionBox
                        whileHover={{ scale: 1.05, y: -5 }}
                        transition={{ duration: 0.2 }}
                        borderRadius="md"
                        overflow="hidden"
                        boxShadow="lg"
                        borderWidth="2px"
                        borderColor="transparent"
                        _groupHover={{ borderColor: borderColor, boxShadow: "xl" }}
                        position="relative"
                    >
                        <Image
                            src={`https://image.tmdb.org/t/p/w500${posterPath}`}
                            alt={title}
                            objectFit="cover"
                            w="100%"
                            h="100%"
                            onLoad={() => setIsLoaded(true)}
                            fallbackSrc="https://via.placeholder.com/500x750?text=No+Poster"
                        />

                        {/* Overlay on hover */}
                        <Box
                            position="absolute"
                            inset="0"
                            bg="blackAlpha.600"
                            opacity="0"
                            _groupHover={{ opacity: 1 }}
                            transition="opacity 0.2s"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                        >
                            <Text color="white" fontWeight="bold" fontSize="sm" textAlign="center" px={2}>
                                View Details
                            </Text>
                        </Box>
                    </MotionBox>
                </Skeleton>
            </AspectRatio>

            <Text
                mt={2}
                fontSize="sm"
                fontWeight="medium"
                color="gray.400"
                noOfLines={1}
                _groupHover={{ color: "white" }}
                transition="color 0.2s"
            >
                {title}
            </Text>
        </Box>
    );
};

export default MovieCard;
