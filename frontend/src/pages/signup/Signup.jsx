import React from "react";
import {
  Button,
  Input,
  FormControl,
  FormLabel,
  Stack,
  Link,
} from "@chakra-ui/react";
import { FaUser, FaLock } from "react-icons/fa";
import { Link as RouterLink } from "react-router-dom";

const Signup = () => {
  return (
    <div className="flex justify-center items-center">
      <div className="bg-gray-700 p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl text-white mb-4">Create an Account</h1>
        <form className="space-y-4">
          <FormControl isRequired>
            <FormLabel htmlFor="username" className="text-white">
              Username
            </FormLabel>
            <Input
              type="text"
              id="username"
              placeholder="Enter your username"
              leftIcon={<FaUser />}
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
              leftIcon={<FaUser />}
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
