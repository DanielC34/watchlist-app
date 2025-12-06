import { useState } from "react";
import {
    Box,
    Container,
    Heading,
    Input,
    InputGroup,
    InputLeftElement,
    VStack,
    HStack,
    Avatar,
    Text,
    Button,
    Spinner,
    useToast,
} from "@chakra-ui/react";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { User } from "../types";
import useAuthStore from "../store/useAuthStore";

const DiscoverUsers = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const navigate = useNavigate();
    const { user: currentUser } = useAuthStore();

    const handleSearch = async (query: string) => {
        setSearchQuery(query);
        if (query.trim().length < 2) {
            setSearchResults([]);
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/users/search?query=${encodeURIComponent(query)}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setSearchResults(response.data);
        } catch (error: any) {
            toast({
                title: "Error searching users",
                description: error.response?.data?.message || "Could not search users",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxW="container.md" py={8}>
            <VStack spacing={6} align="stretch">
                <Heading size="lg">Discover Users</Heading>

                <InputGroup>
                    <InputLeftElement pointerEvents="none">
                        <FaSearch color="gray" />
                    </InputLeftElement>
                    <Input
                        placeholder="Search users by username..."
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                        bg="gray.800"
                        border="none"
                        _focus={{ ring: 2, ringColor: "blue.500" }}
                    />
                </InputGroup>

                {loading && (
                    <Box textAlign="center" py={8}>
                        <Spinner size="xl" color="blue.500" />
                    </Box>
                )}

                {!loading && searchQuery && searchResults.length === 0 && (
                    <Text textAlign="center" color="gray.400" py={8}>
                        No users found matching "{searchQuery}"
                    </Text>
                )}

                <VStack spacing={3} align="stretch">
                    {searchResults.map((user) => (
                        <Box
                            key={user._id}
                            bg="gray.800"
                            p={4}
                            borderRadius="md"
                            _hover={{ bg: "gray.700" }}
                            cursor="pointer"
                        >
                            <HStack justify="space-between">
                                <HStack
                                    spacing={3}
                                    flex={1}
                                    onClick={() => navigate(`/profile/${user._id}`)}
                                >
                                    <Avatar size="md" name={user.username} src={user.profilePicture} />
                                    <Box>
                                        <Text fontWeight="bold" color="white">
                                            {user.username}
                                        </Text>
                                        <Text fontSize="sm" color="gray.400">
                                            {user.email}
                                        </Text>
                                    </Box>
                                </HStack>
                                {currentUser && currentUser._id !== user._id && (
                                    <Button
                                        size="sm"
                                        colorScheme="blue"
                                        onClick={() => navigate(`/profile/${user._id}`)}
                                    >
                                        View Profile
                                    </Button>
                                )}
                            </HStack>
                        </Box>
                    ))}
                </VStack>
            </VStack>
        </Container>
    );
};

export default DiscoverUsers;
