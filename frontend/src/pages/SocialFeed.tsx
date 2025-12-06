import { useEffect, useState } from "react";
import {
    Box,
    Container,
    Heading,
    VStack,
    HStack,
    Avatar,
    Text,
    Spinner,
    useToast,
    Flex,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { User } from "../types";

interface FeedActivity {
    type: "added" | "rated";
    user: User;
    movie: any;
    watchlistName: string;
    timestamp: Date;
}

const SocialFeed = () => {
    const [activities, setActivities] = useState<FeedActivity[]>([]);
    const [loading, setLoading] = useState(true);
    const toast = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFeed = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(
                    `${import.meta.env.VITE_API_URL}/users/feed`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                setActivities(response.data);
            } catch (error: any) {
                toast({
                    title: "Error fetching feed",
                    description: error.response?.data?.message || "Could not load feed",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });
            } finally {
                setLoading(false);
            }
        };

        fetchFeed();
    }, [toast]);

    if (loading) {
        return (
            <Flex justify="center" align="center" h="50vh">
                <Spinner size="xl" color="blue.500" />
            </Flex>
        );
    }

    if (activities.length === 0) {
        return (
            <Container maxW="container.md" py={8}>
                <Text textAlign="center" color="gray.400">
                    No activity yet. Follow some users to see their activity here!
                </Text>
            </Container>
        );
    }

    const getActivityText = (activity: FeedActivity) => {
        if (activity.type === "added") {
            return `added ${activity.movie.title} to ${activity.watchlistName}`;
        } else if (activity.type === "rated") {
            return `rated ${activity.movie.title} ⭐ ${activity.movie.rating}/5`;
        }
        return "";
    };

    const formatTimestamp = (timestamp: Date) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMins < 1) return "just now";
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays === 1) return "yesterday";
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString();
    };

    return (
        <Container maxW="container.md" py={8}>
            <Heading size="lg" mb={6}>Social Feed</Heading>
            <VStack spacing={4} align="stretch">
                {activities.map((activity, index) => (
                    <Box
                        key={`${activity.user._id}-${activity.movie.movieId}-${index}`}
                        bg="gray.800"
                        p={4}
                        borderRadius="md"
                        _hover={{ bg: "gray.700" }}
                    >
                        <HStack spacing={3} align="start">
                            <Avatar
                                size="sm"
                                name={activity.user.username}
                                src={activity.user.profilePicture}
                                cursor="pointer"
                                onClick={() => navigate(`/profile/${activity.user._id}`)}
                            />
                            <VStack align="start" spacing={1} flex={1}>
                                <HStack>
                                    <Text
                                        fontWeight="bold"
                                        color="white"
                                        cursor="pointer"
                                        onClick={() => navigate(`/profile/${activity.user._id}`)}
                                        _hover={{ textDecoration: "underline" }}
                                    >
                                        {activity.user.username}
                                    </Text>
                                    <Text color="gray.400" fontSize="sm">
                                        {getActivityText(activity)}
                                    </Text>
                                </HStack>
                                <HStack>
                                    {activity.movie.posterPath && (
                                        <Box
                                            w="40px"
                                            h="60px"
                                            borderRadius="sm"
                                            overflow="hidden"
                                            flexShrink={0}
                                            cursor="pointer"
                                            onClick={() => navigate(`/${activity.movie.media_type}/${activity.movie.movieId}`)}
                                        >
                                            <img
                                                src={`https://image.tmdb.org/t/p/w200${activity.movie.posterPath}`}
                                                alt={activity.movie.title}
                                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                            />
                                        </Box>
                                    )}
                                    <Box flex={1}>
                                        <Text fontSize="sm" color="gray.500">
                                            {formatTimestamp(activity.timestamp)}
                                        </Text>
                                    </Box>
                                </HStack>
                            </VStack>
                        </HStack>
                    </Box>
                ))}
            </VStack>
        </Container>
    );
};

export default SocialFeed;
