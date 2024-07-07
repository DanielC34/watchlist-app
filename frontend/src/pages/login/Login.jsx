import React from 'react'
import { Button, Input, FormControl, FormLabel, FormHelperText } from "@chakra-ui/react";
import { FaUser, FaLock } from "react-icons/fa";
import {  Link, Link as RouterLink } from "react-router-dom";

const Login = () => {
  return (
    <div className="flex justify-center items-center">
      <div className="bg-gray-700 p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl text-white mb-4">Login</h1>
        <form className="space-y-4">
          <FormControl>
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
          <Button
            type="submit"
            colorScheme="red"
            size="lg"
            w="full"
          >
            Login
          </Button>
          <Link as={RouterLink}  to="/signup" color="gray.200" textAlign="center">
            New here? Sign up here
          </Link>
        </form>
      </div>
    </div>
  );
}

export default Login