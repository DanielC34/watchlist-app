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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const toast = useToast();
  const navigate = useNavigate();
  const { login, setUsername } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const user = await login(email, password);

      // Assume 'login' returns a user object with a username
      setUsername(user.username);

      toast({
        title: "Login successful.",
        description: `Hey there!! Welcome back ${user.username}`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      navigate("/");
    } catch (error) {
      toast({
        title: "Error.",
        description:
          error.response?.data?.message || "Invalid email or password.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-gray-700 p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl text-white mb-4">Login</h1>

        <form className="space-y-4" onSubmit={handleSubmit}>
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
            Login
          </Button>

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
