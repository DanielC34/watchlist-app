import React, { useState, useEffect } from "react";
import {
  Button,
  Input,
  FormControl,
  FormLabel,
  Link,
  useToast,
} from "@chakra-ui/react";
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import useAuthStore from "../../store/useAuthStore";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const toast = useToast();
  const navigate = useNavigate();
  const { signup, error, clearError } = useAuthStore();

  useEffect(() => {
    return () => clearError(); // Clear error when component unmounts
  }, [clearError]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      clearError();
      await signup(username, email, password); // Trigger signup action

      toast({
        title: "Account created.",
        description: `Hello!! Welcome to FilmVault, ${username}`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      navigate("/"); // Redirect to home page after successful signup
    } catch (error) {
      toast({
        title: "Error.",
        description: error.response?.data?.message || "Something went wrong.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-gray-700 p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl text-white mb-4">Create an Account</h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <FormControl isRequired>
            <FormLabel htmlFor="username" className="text-white">
              Username
            </FormLabel>
            <Input
              type="text"
              id="username"
              placeholder="Enter your username"
              leftIcon={<FaUser />}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel htmlFor="email" className="text-white">
              Email
            </FormLabel>
            <Input
              type="email"
              id="email"
              placeholder="Enter your email"
              leftIcon={<FaEnvelope />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel htmlFor="password" className="text-white">
              Password
            </FormLabel>
            <Input
              type="password"
              id="password"
              placeholder="Enter your password"
              leftIcon={<FaLock />}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormControl>

          <Button type="submit" colorScheme="red" size="lg" w="full">
            Sign Up
          </Button>

          <Link as={RouterLink} to="/login" color="gray.200" textAlign="center">
            Already have an account? Login here
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Signup;
