import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Divider, IconButton, Box, Text, Flex, Avatar } from "@chakra-ui/react";
import {
  FaHome,
  FaHistory,
  FaFilm,
  FaTv,
  FaPlus,
  FaTimes,
  FaBars,
  FaSearch,
} from "react-icons/fa";
import { Button } from "@chakra-ui/react";
import useAuthStore from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import { useWatchlistStore } from "../store/useWatchlistStore";
import LogoutModal from "./LogoutModal";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const { watchlist, getWatchlist } = useWatchlistStore();
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      getWatchlist();
    }
  }, [isAuthenticated, getWatchlist]);

  // Close sidebar when route changes (especially on mobile)
  useEffect(() => {
    setIsOpen(false);
    document.body.classList.remove("overflow-hidden");
  }, [location]);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  };

  // Function to handle login button click
  const handleLoginClick = () => {
    navigate("/profile");
  };

  const handleLogout = () => {
    logout();
    setLogoutModalOpen(false);
    // Optionally navigate to home or login page
    navigate("/");
  };

  // Check if the current path matches the link path
  const isActive = (path) => {
    return location.pathname === path;
  };

  // NavLink component for consistent styling
  const NavLink = ({ to, icon, children }) => {
    const active = isActive(to);
    return (
      <Link to={to} className="w-full">
        <Flex
          align="center"
          py={2}
          px={3}
          borderRadius="md"
          bg={active ? "rgba(229, 62, 62, 0.2)" : "transparent"}
          color={active ? "red.400" : "white"}
          _hover={{ bg: "rgba(229, 62, 62, 0.1)", color: "red.300" }}
          transition="all 0.2s"
        >
          <Box mr={3}>{icon}</Box>
          <Text fontWeight={active ? "bold" : "normal"}>{children}</Text>
        </Flex>
      </Link>
    );
  };

  // Overlay for mobile
  const MobileOverlay = () => (
    <Box
      display={{ base: isOpen ? "block" : "none", md: "none" }}
      position="fixed"
      top={0}
      left={0}
      right={0}
      bottom={0}
      bg="rgba(0, 0, 0, 0.7)"
      zIndex={40}
      onClick={toggleSidebar}
    />
  );

  return (
    <>
      {/* Mobile Header Bar */}
      <Box
        position="fixed"
        top="0"
        left="0"
        right="0"
        height="60px"
        bg="gray.900"
        display={{ base: "flex", md: "none" }}
        alignItems="center"
        px={4}
        zIndex={30}
        boxShadow="md"
      >
        <IconButton
          aria-label={isOpen ? "Close Menu" : "Open Menu"}
          icon={isOpen ? <FaTimes /> : <FaBars />}
          onClick={toggleSidebar}
          colorScheme="red"
          variant="ghost"
          size="md"
        />
        <Text fontSize="xl" fontWeight="bold" color="red.500" ml={4}>
          FilmVault
        </Text>
      </Box>

      {/* Mobile Overlay */}
      <MobileOverlay />

      {/* Sidebar */}
      <Box
        position={{ base: "fixed", md: "sticky" }}
        top="0"
        left="0"
        h="100vh"
        w={{ base: "240px", md: "100%" }}
        bg="gray.800"
        transform={{
          base: isOpen ? "translateX(0)" : "translateX(-100%)",
          md: "translateX(0)",
        }}
        transition="transform 0.3s ease-in-out"
        zIndex={50}
        boxShadow={{ base: isOpen ? "2xl" : "none", md: "none" }}
        overflowY="auto"
        className="scrollbar-hide"
      >
        {/* Logo - only show on desktop or when mobile menu is open */}
        <Flex
          justify="center"
          align="center"
          py={6}
          display={{ base: "none", md: "flex" }}
        >
          <Text fontSize="2xl" fontWeight="bold" color="red.500">
            FilmVault
          </Text>
        </Flex>

        {/* Navigation Links */}
        <Box px={4} mb={6} mt={{ base: 6, md: 0 }}>
          <NavLink to="/" icon={<FaHome />}>
            Home
          </NavLink>
          <NavLink to="/movies" icon={<FaFilm />}>
            Movies
          </NavLink>
          <NavLink to="/shows" icon={<FaTv />}>
            TV Shows
          </NavLink>
          <NavLink to="/history" icon={<FaSearch />}>
            Search
          </NavLink>

          <Box mt={4} mb={4}>
            <Link to="/create-watchlist">
              <Button
                leftIcon={<FaPlus />}
                colorScheme="red"
                variant="solid"
                size="sm"
                width="100%"
              >
                Create Watchlist
              </Button>
            </Link>
          </Box>
        </Box>

        <Divider />

        {/* My Lists Section */}
        <Box px={4} py={4}>
          <Text fontWeight="bold" mb={2} color="gray.300">
            MY LISTS
          </Text>
          {isAuthenticated ? (
            <>
              {watchlist && watchlist.length > 0 ? (
                <Box>
                  {watchlist.map((list) => (
                    <Link key={list._id} to={`/watchlist/${list._id}`}>
                      <Flex
                        py={2}
                        px={3}
                        borderRadius="md"
                        _hover={{
                          bg: "rgba(229, 62, 62, 0.1)",
                          color: "red.300",
                        }}
                        transition="all 0.2s"
                        align="center"
                      >
                        <Text fontSize="sm" noOfLines={1}>
                          {list.name}
                        </Text>
                      </Flex>
                    </Link>
                  ))}
                </Box>
              ) : (
                <Text fontSize="sm" color="gray.400" fontStyle="italic">
                  No watchlists yet
                </Text>
              )}
            </>
          ) : (
            <Box>
              <Text fontSize="sm" color="gray.400" fontStyle="italic" mb={2}>
                Login to see your watchlists
              </Text>
            </Box>
          )}
        </Box>

        {/* Footer with Login/Logout Button */}
        <Box px={4} mt="auto" pb={6} position="sticky" bottom="0">
          <Divider mb={4} />

          {/* User Profile Container - Moved here */}
          {isAuthenticated && (
            <Box
              borderWidth="1px"
              borderColor="gray.600"
              borderRadius="md"
              p={3}
              bg="gray.700"
              mb={4}
              cursor="pointer"
              onClick={() => navigate("/profile")}
              _hover={{ bg: "gray.600", transition: "all 0.2s" }}
            >
              <Flex align="center">
                <Avatar size="sm" name={user.username} mr={3} />
                <Box>
                  <Text fontSize="sm" fontWeight="medium" color="white">
                    {user.username}
                  </Text>
                  <Text fontSize="xs" color="gray.400">
                    {user.email}
                  </Text>
                </Box>
              </Flex>
            </Box>
          )}

          {isAuthenticated ? (
            <Button
              colorScheme="red"
              variant="outline"
              width="100%"
              onClick={() => setLogoutModalOpen(true)}
            >
              Logout
            </Button>
          ) : (
            <Button
              colorScheme="red"
              variant="outline"
              width="100%"
              onClick={handleLoginClick}
            >
              Login / Sign Up
            </Button>
          )}

          <LogoutModal
            isOpen={logoutModalOpen}
            onClose={() => setLogoutModalOpen(false)}
            onConfirm={handleLogout}
          />
        </Box>
      </Box>

      {/* Content Spacer for Mobile */}
      <Box height="60px" display={{ base: "block", md: "none" }} />
    </>
  );
};

export default Navbar;
