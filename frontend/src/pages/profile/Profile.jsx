import React, { useState, useEffect } from "react";
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
} from "@chakra-ui/react";
import { FaEnvelope, FaLock, FaUser } from "react-icons/fa";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import useAuthStore from "../../store/useAuthStore";

const Profile = () => {
  // State for login form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // State for signup form
  const [username, setUsername] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");

  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const toast = useToast();

  // Initialize state from the Auth Store
  const { user, login, signup, isAuthenticated, error, clearError } =
    useAuthStore((state) => ({
      user: state.user,
      login: state.login,
      signup: state.signup,
      isAuthenticated: state.isAuthenticated,
      error: state.error,
      clearError: state.clearError,
    }));

  // Handle login form submission
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);

      // Check if login was successful
      if (isAuthenticated) {
        toast({
          title: "Login successful.",
          description: `Welcome back, ${user.username}`,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        onClose(); // Close the modal
        navigate("/"); // Redirect to home page
      }
    } catch (err) {
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

  // Handle signup form submission
  const handleSignup = async (e) => {
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

      onClose(); // Close the modal
      navigate("/"); // Redirect to home page
    } catch (err) {
      toast({
        title: "Error.",
        description: err.response?.data?.message || "Something went wrong.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // Effect to open modal when navigated to /profile and not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      onOpen();
    }
  }, [isAuthenticated, onOpen]);

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="md">
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
                {/* Login Tab */}
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
                            onChange={(e) => setEmail(e.target.value)}
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
                            onChange={(e) => setPassword(e.target.value)}
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

                {/* Signup Tab */}
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
                            onChange={(e) => setUsername(e.target.value)}
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
                            onChange={(e) => setSignupEmail(e.target.value)}
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
                            onChange={(e) => setSignupPassword(e.target.value)}
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
            <Button colorScheme="gray" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Display user profile when authenticated */}
      {isAuthenticated && (
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
      )}
    </>
  );
};

export default Profile;
