import React from "react";

import { useNavigate } from "react-router-dom";
import { Button, Flex, Avatar, Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import useAuthStore from "../store/useAuthStore";
import { FaUser, FaList, FaSignOutAlt } from "react-icons/fa";

const Header = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <Flex justify="space-between" align="center">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-red-500 tracking-tight">FilmVault</h1>
            <p className="text-xs md:text-sm text-gray-400 mt-1">
              Track films and TV shows you want to watch
            </p>
          </div>
          
          {/* Desktop Auth Actions */}
          <div className="hidden md:block">
            {isAuthenticated ? (
              <Menu>
                <MenuButton>
                  <Flex align="center" gap={2} cursor="pointer" _hover={{ opacity: 0.8 }}>
                    <Avatar size="sm" name={user.username} />
                    <span className="text-sm text-gray-300">{user.username}</span>
                  </Flex>
                </MenuButton>
                <MenuList bg="gray.800" borderColor="gray.700">
                  <MenuItem icon={<FaUser />} onClick={() => navigate("/profile")} bg="gray.800" _hover={{ bg: "gray.700" }}>
                    Profile
                  </MenuItem>
                  <MenuItem icon={<FaList />} onClick={() => navigate("/watchlist")} bg="gray.800" _hover={{ bg: "gray.700" }}>
                    My Watchlists
                  </MenuItem>
                  <MenuItem icon={<FaSignOutAlt />} onClick={handleLogout} bg="gray.800" _hover={{ bg: "gray.700" }} color="red.400">
                    Logout
                  </MenuItem>
                </MenuList>
              </Menu>
            ) : (
              <Button
                colorScheme="red"
                size="sm"
                onClick={() => navigate("/profile")}
              >
                Login / Sign Up
              </Button>
            )}
          </div>
        </Flex>
      </div>
    </header>
  );
}

export default Header