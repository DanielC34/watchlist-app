import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Box,
    Container,
    Flex,
    Heading,
    Text,
    Avatar,
    SimpleGrid,
    Stat,
    StatLabel,
    StatNumber,
    StatHelpText,
    VStack,
    useToast,
    Spinner,
    Button,
} from "@chakra-ui/react";
import axios from "axios";
import { User } from "../types";
import useAuthStore from "../store/useAuthStore";

interface UserProfile {
    user: User & { followers: string[]; following: string[] };
    stats: {
        totalWatched: number;
        totalMovies: number;
        totalRatings: number;
        averageRating: number;
    };
    mutualFollowers?: User[];
}

const Profile = () => {
    const { userId } = useParams<{ userId: string }>();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [isFollowing, setIsFollowing] = useState(false);
    const [followLoading, setFollowLoading] = useState(false);
    const toast = useToast();
    const { user: currentUser } = useAuthStore();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(
                    `${import.meta.env.VITE_API_URL}/users/profile/${userId}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                setProfile(response.data);
                if (currentUser && response.data.user.followers.includes(currentUser._id)) {
                    setIsFollowing(true);
                }
            } catch (error: any) {
                toast({
                    title: "Error fetching profile",
                    description: error.response?.data?.message || "Could not load profile",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchProfile();
        }
    }, [userId, toast, currentUser]);

    const handleFollow = async () => {
        if (!profile || !currentUser) return;
        setFollowLoading(true);
        try {
            const token = localStorage.getItem("token");
            if (isFollowing) {
                await axios.put(
                    `${import.meta.env.VITE_API_URL}/users/unfollow/${userId}`,
                    {},
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setIsFollowing(false);
                setProfile((prev) =>
                    prev
                        ? {
                            ...prev,
                            user: {
                                ...prev.user,
                                followers: prev.user.followers.filter((id) => id !== currentUser._id),
                            },
                        }
                        : null
                );
                toast({ title: "Unfollowed user", status: "success", duration: 2000 });
            } else {
                await axios.put(
                    `${import.meta.env.VITE_API_URL}/users/follow/${userId}`,
                    {},
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setIsFollowing(true);
                setProfile((prev) =>
                    prev
                        ? {
                            ...prev,
                            user: {
                                ...prev.user,
                                followers: [...prev.user.followers, currentUser._id],
                            },
                        }
                        : null
                );
                toast({ title: "Followed user", status: "success", duration: 2000 });
            }
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.response?.data?.message || "Something went wrong",
                status: "error",
                duration: 3000,
            });
        } finally {
            setFollowLoading(false);
        }
    };

    if (loading) {
        return (
            <Flex justify="center" align="center" h="50vh">
                <Spinner size="xl" color="blue.500" />
            </Flex>
        );
    }

    if (!profile) {
        return (
            <Container maxW="container.lg" py={8}>
                <Text>User not found</Text>
            </Container>
        );
    }

    return (
        <Container maxW="container.lg" py={8}>
            <Flex direction={{ base: "column", md: "row" }} align="center" mb={8}>
                <Avatar
                    size="2xl"
                    name={profile.user.username}
                    src={profile.user.profilePicture}
                    mb={{ base: 4, md: 0 }}
                    mr={{ md: 8 }}
                />
                <VStack align={{ base: "center", md: "start" }} spacing={1} flex={1}>
                    <Heading size="xl">{profile.user.username}</Heading>
                    <Text color="gray.400">Member since {new Date().getFullYear()}</Text>
                    <Flex mt={2} gap={4}>
                        <Text color="gray.300">
                            <Text as="span" fontWeight="bold" color="white">
                                {profile.user.followers?.length || 0}
                            </Text>{" "}
                            Followers
                        </Text>
                        <Text color="gray.300">
                            <Text as="span" fontWeight="bold" color="white">
                                {profile.user.following?.length || 0}
                            </Text>{" "}
                            Following
                        </Text>
                    </Flex>
                </VStack>
                {currentUser && currentUser._id !== profile.user._id && (
                    <Button
                        colorScheme={isFollowing ? "gray" : "blue"}
                        onClick={handleFollow}
                        isLoading={followLoading}
                        mt={{ base: 4, md: 0 }}
                    >
                        {isFollowing ? "Unfollow" : "Follow"}
                    </Button>
                )}
            </Flex>

            <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4} mb={8}>
                <Stat bg="gray.800" p={4} borderRadius="md">
                    <StatLabel color="gray.400">Total Watched</StatLabel>
                    <StatNumber fontSize="3xl">{profile.stats.totalWatched}</StatNumber>
                    <StatHelpText>Movies/Shows</StatHelpText>
                </Stat>
                <Stat bg="gray.800" p={4} borderRadius="md">
                    <StatLabel color="gray.400">Watchlist</StatLabel>
                    <StatNumber fontSize="3xl">{profile.stats.totalMovies}</StatNumber>
                    <StatHelpText>Total Items</StatHelpText>
                </Stat>
                <Stat bg="gray.800" p={4} borderRadius="md">
                    <StatLabel color="gray.400">Ratings</StatLabel>
                    <StatNumber fontSize="3xl">{profile.stats.totalRatings}</StatNumber>
                    <StatHelpText>Given</StatHelpText>
                </Stat>
                <Stat bg="gray.800" p={4} borderRadius="md">
                    <StatLabel color="gray.400">Avg Rating</StatLabel>
                    <StatNumber fontSize="3xl">{profile.stats.averageRating}</StatNumber>
                    <StatHelpText>Stars</StatHelpText>
                </Stat>
            </SimpleGrid>

            {profile.mutualFollowers && profile.mutualFollowers.length > 0 && (
                <Box bg="gray.800" p={6} borderRadius="md" mb={8}>
                    <Heading size="md" mb={4}>Mutual Followers</Heading>
                    <Flex gap={2} flexWrap="wrap">
                        {profile.mutualFollowers.slice(0, 5).map((mutualUser) => (
                            <Avatar
                                key={mutualUser._id}
                                size="sm"
                                name={mutualUser.username}
                                src={mutualUser.profilePicture}
                                cursor="pointer"
                                onClick={() => navigate(`/profile/${mutualUser._id}`)}
                                title={mutualUser.username}
                            />
                        ))}
                        {profile.mutualFollowers.length > 5 && (
                            <Text color="gray.400" fontSize="sm" alignSelf="center">
                                +{profile.mutualFollowers.length - 5} more
                            </Text>
                        )}
                    </Flex>
                </Box>
            )}

            <Box bg="gray.800" p={6} borderRadius="md">
                <Heading size="md" mb={4}>About</Heading>
                <Text color="gray.400">
                    This user hasn't written a bio yet.
                </Text>
            </Box>
        </Container>
    );
};

export default Profile;
