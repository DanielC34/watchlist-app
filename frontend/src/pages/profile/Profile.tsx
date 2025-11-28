import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Input,
  FormControl,
  FormLabel,
  useToast,
  Text,
  VStack,
  useDisclosure,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Flex,
  Box,
  Avatar,
  SimpleGrid,
  Spinner,
} from "@chakra-ui/react";
import {
  FaEnvelope,
  FaLock,
  FaUser,
  FaBookmark,
  FaRegBookmark,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../../store/useAuthStore";
import { useWatchlistStore } from "../../store/useWatchlistStore";

const Profile = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [signupEmail, setSignupEmail] = useState<string>("");
  const [signupPassword, setSignupPassword] = useState<string>("");

  const { isOpen, onOpen, onClose: chakraOnClose } = useDisclosure();
  const navigate = useNavigate();
  const toast = useToast();

  const { user, login, signup, isAuthenticated, clearError } = useAuthStore();
  const { watchlist, getWatchlist, loading } = useWatchlistStore();

  useEffect(() => {
    if (isAuthenticated && isOpen) {
      handleModalClose();
      toast({
        title: "Login successful.",
        description: `Welcome back, ${user.username}`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    }
  }, [isAuthenticated]);

  useEffect(() => {
    getWatchlist();
  }, [getWatchlist]);

  const handleModalClose = () => {
    chakraOnClose();
    navigate("/movies");
  };

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (err: any) {
      toast({
        title: "Error.",
        description:
          err.response?.data?.message || "Invalid email or password.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleSignup = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      clearError();
      await signup(username, signupEmail, signupPassword);

      toast({
        title: "Account created.",
        description: `Welcome to FilmVault, ${username}`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      handleModalClose();
    } catch (err: any) {
      toast({
        title: "Error.",
        description: err.response?.data?.message || "Something went wrong.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      onOpen();
    }
  }, [isAuthenticated, onOpen]);

  return (
    <>
      <Modal isOpen={isOpen} onClose={handleModalClose} size="md">
        <ModalOverlay />
        <ModalContent bg="gray.800" color="white">
          <ModalHeader fontSize="xl">Welcome to FilmVault</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Tabs isFitted variant="enclosed" colorScheme="red">
              <TabList mb="1em">
                <Tab>Login</Tab>
                <Tab>Sign Up</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <form onSubmit={handleLogin}>
                    <VStack spacing={4}>
                      <FormControl isRequired>
                        <FormLabel>Email</FormLabel>
                        <Flex align="center">
                          <FaEnvelope style={{ marginRight: "10px" }} />
                          <Input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                          />
                        </Flex>
                      </FormControl>
                      <FormControl isRequired>
                        <FormLabel>Password</FormLabel>
                        <Flex align="center">
                          <FaLock style={{ marginRight: "10px" }} />
                          <Input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                          />
                        </Flex>
                      </FormControl>
                      <Button
                        type="submit"
                        colorScheme="red"
                        size="lg"
                        w="full"
                      >
                        Login
                      </Button>
                    </VStack>
                  </form>
                </TabPanel>

                <TabPanel>
                  <form onSubmit={handleSignup}>
                    <VStack spacing={4}>
                      <FormControl isRequired>
                        <FormLabel>Username</FormLabel>
                        <Flex align="center">
                          <FaUser style={{ marginRight: "10px" }} />
                          <Input
                            type="text"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                          />
                        </Flex>
                      </FormControl>
                      <FormControl isRequired>
                        <FormLabel>Email</FormLabel>
                        <Flex align="center">
                          <FaEnvelope style={{ marginRight: "10px" }} />
                          <Input
                            type="email"
                            placeholder="Enter your email"
                            value={signupEmail}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setSignupEmail(e.target.value)}
                          />
                        </Flex>
                      </FormControl>
                      <FormControl isRequired>
                        <FormLabel>Password</FormLabel>
                        <Flex align="center">
                          <FaLock style={{ marginRight: "10px" }} />
                          <Input
                            type="password"
                            placeholder="Enter your password"
                            value={signupPassword}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setSignupPassword(e.target.value)}
                          />
                        </Flex>
                      </FormControl>
                      <Button
                        type="submit"
                        colorScheme="red"
                        size="lg"
                        w="full"
                      >
                        Sign Up
                      </Button>
                    </VStack>
                  </form>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="gray" mr={3} onClick={handleModalClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {isAuthenticated && (
        <Box maxW="container.md" mx="auto" py={8}>
          <Box
            p={4}
            bg="gray.700"
            color="white"
            maxWidth="400px"
            mx="auto"
            mt={6}
            borderRadius="md"
            boxShadow="md"
          >
            <VStack spacing={4}>
              <Avatar size="xl" src={user?.profilePicture} />
              <Text fontSize="lg" fontWeight="bold">
                {user?.username || "Username not available"}
              </Text>
              <Text fontSize="md">{user?.email || "Email not available"}</Text>
            </VStack>
          </Box>

          <Box mt={10}>
            <Text fontSize="2xl" fontWeight="bold" mb={4}>
              My Watchlists
            </Text>
            {loading ? (
              <Flex justify="center" align="center" minH="100px">
                <Spinner />
              </Flex>
            ) : watchlist && watchlist.length > 0 ? (
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                {watchlist.map((wl) => {
                  const allWatched =
                    wl.items &&
                    wl.items.length > 0 &&
                    wl.items.every((item: any) => item.watched);
                  return (
                    <Link key={wl._id} to={`/watchlist/${wl._id}`}>
                      <Box
                        p={4}
                        borderWidth="1px"
                        borderRadius="md"
                        bg="gray.700"
                        _hover={{ bg: "gray.600", boxShadow: "md" }}
                        transition="all 0.2s"
                        cursor="pointer"
                        position="relative"
                      >
                        <Box position="absolute" top={2} left={2} zIndex={1}>
                          {allWatched ? (
                            <FaBookmark color="#E53E3E" size={20} />
                          ) : (
                            <FaRegBookmark color="#A0AEC0" size={20} />
                          )}
                        </Box>
                        <Text fontWeight="bold" pl={7}>
                          {wl.name}
                        </Text>
                        {wl.description && (
                          <Text fontSize="sm" color="gray.400" mt={1} pl={7}>
                            {wl.description}
                          </Text>
                        )}
                        <Text fontSize="xs" color="gray.500" mt={2} pl={7}>
                          {wl.items?.length || 0} items
                        </Text>
                      </Box>
                    </Link>
                  );
                })}
              </SimpleGrid>
            ) : (
              <Text color="gray.400">You have no watchlists yet.</Text>
            )}
          </Box>
        </Box>
      )}
    </>
  );
};

export default Profile;
