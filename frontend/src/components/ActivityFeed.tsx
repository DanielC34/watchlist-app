import { useEffect, useState } from "react";
import { Box, Heading, Text, SimpleGrid, Flex, Badge, Skeleton } from "@chakra-ui/react";
import { getRecentActivityAPI } from "../api/watchlistApi";
import { WatchlistItem } from "../types";
import { Link } from "react-router-dom";
import { FaClock, FaEye, FaPlay } from "react-icons/fa";

const ActivityFeed = () => {
    const [activity, setActivity] = useState<(WatchlistItem & { watchlistName?: string; watchlistId?: string })[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchActivity = async () => {
            try {
                const data = await getRecentActivityAPI();
                setActivity(data as any);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchActivity();
    }, []);

    if (loading) {
        return (
            <Box mb={8}>
                <Heading size="md" mb={4} color="gray.100">Recent Activity</Heading>
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} height="80px" borderRadius="md" />
                    ))}
                </SimpleGrid>
            </Box>
        );
    }

    if (error || activity.length === 0) {
        return null;
    }

    const getStatusIcon = (status?: string) => {
        switch (status) {
            case "watched": return <FaEye color="#48BB78" />;
            case "watching": return <FaPlay color="#ED8936" />;
            default: return <FaClock color="#4299E1" />;
        }
    };

    return (
        <Box mb={8}>
            <Heading size="md" mb={4} color="gray.100">Recent Activity</Heading>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
                {activity.map((item) => (
                    <Link to={`/${item.media_type}/${item.movieId}`} key={`${item._id}-${item.addedAt}`}>
                        <Flex
                            bg="gray.800"
                            p={3}
                            borderRadius="md"
                            align="center"
                            _hover={{ bg: "gray.700", transform: "translateY(-2px)", transition: "all 0.2s" }}
                        >
                            <Box
                                w="50px"
                                h="75px"
                                flexShrink={0}
                                borderRadius="sm"
                                overflow="hidden"
                                mr={3}
                            >
                                <img
                                    src={`https://image.tmdb.org/t/p/w200${item.posterPath}`}
                                    alt={item.title}
                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                />
                            </Box>
                            <Box flex="1" overflow="hidden">
                                <Text fontWeight="bold" noOfLines={1} color="white" fontSize="sm">
                                    {item.title}
                                </Text>
                                <Flex align="center" mt={1} fontSize="xs" color="gray.400">
                                    <Box mr={2}>{getStatusIcon(item.status)}</Box>
                                    <Text mr={2}>
                                        {item.status === "watched" ? "Watched" : item.status === "watching" ? "Watching" : "Added to"}
                                    </Text>
                                    {item.watchlistName && (
                                        <Badge colorScheme="purple" fontSize="xx-s" variant="subtle">
                                            {item.watchlistName}
                                        </Badge>
                                    )}
                                </Flex>
                                <Text fontSize="xs" color="gray.500" mt={1}>
                                    {new Date(item.addedAt).toLocaleDateString()}
                                </Text>
                            </Box>
                        </Flex>
                    </Link>
                ))}
            </SimpleGrid>
        </Box>
    );
};

export default ActivityFeed;
