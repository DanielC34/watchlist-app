import React, { useState } from "react";
import {
  Link,
  Button,
  Input,
  FormControl,
  FormLabel,
  useToast,
} from "@chakra-ui/react";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import useAuthStore from "../../store/useAuthStore";

const Login = () => {
  // State for storing user input
  const [email, setEmail] = useState(""); // Email input state
  const [password, setPassword] = useState(""); // Password input state
  const toast = useToast(); // Toast for notifications
  const navigate = useNavigate(); // Navigation hook to redirect users

  // Accessing login function and authentication state from the store
  const { login, user, isAuthenticated } = useAuthStore((state) => ({
    login: state.login, // Login function from useAuthStore
    user: state.user, // Current logged-in user data
    isAuthenticated: state.isAuthenticated, // Authentication status
  }));

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevents page reload on form submission

    try {
      // Trigger login action
      await login(email, password); // Calls the login function with user input

      // Adding a slight delay before redirecting to ensure state update
      setTimeout(() => {
        if (isAuthenticated) {
          // If login is successful
          toast({
            title: "Login successful.",
            description: `Hey there!! Welcome back, ${user.username}`, // Welcome message
            status: "success",
            duration: 5000,
            isClosable: true,
          });

          // Redirecting to the movies page after successful login
          navigate("/movies");
        }
      }, 100); // Adjust delay as necessary
    } catch (error) {
      // Error handling for invalid login
      toast({
        title: "Error.",
        description:
          error.response?.data?.message || "Invalid email or password.", // Error message
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // JSX for the login form
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-gray-700 p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl text-white mb-4">Login</h1>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Email input */}
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
              onChange={(e) => setEmail(e.target.value)} // Update email state
            />
          </FormControl>

          {/* Password input */}
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
              onChange={(e) => setPassword(e.target.value)} // Update password state
            />
          </FormControl>

          {/* Login button */}
          <Button type="submit" colorScheme="red" size="lg" w="full">
            Login
          </Button>

          {/* Link to the signup page */}
          <Link
            as={RouterLink}
            to="/signup"
            color="gray.200"
            textAlign="center"
          >
            New here? Sign up here
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Login;
