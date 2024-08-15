// src/components/Logout.js
import React from "react";
import { Button, useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/useAuthStore";

const Logout = () => {
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  const toast = useToast();

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out.",
      description: "You have been logged out successfully.",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
    navigate("/login");
  };

  return (
    <Button onClick={handleLogout} colorScheme="red">
      Logout
    </Button>
  );
};

export default Logout;
