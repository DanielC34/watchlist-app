import { useState, useEffect, ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Divider, IconButton, Box, Text, Flex, Avatar, Button } from "@chakra-ui/react";
import {
  FaHome,
  FaFilm,
  FaTv,
  FaPlus,
  FaTimes,
  FaBars,
  FaSearch,
} from "react-icons/fa";
import useAuthStore from "../store/useAuthStore";
import { useWatchlistStore } from "../store/useWatchlistStore";
import LogoutModal from "./LogoutModal";
import { Watchlist } from "../types";

type NavLinkProps = {
  to: string;
  icon: ReactNode;
  children: ReactNode;
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState<boolean>(false);
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

  const handleLogout = () => {
    logout();
    setLogoutModalOpen(false);
    // Optionally navigate to home or login page
    navigate("/");
  };

  // Check if the current path matches the link path
  const isActive = (path: string): boolean => {
    return location.pathname === path;
  };

  // NavLink component for consistent styling
  const NavLink = ({ to, icon, children }: NavLinkProps) => {
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
      {/* Mobile Bottom Navigation */}
      <Box
        position="fixed"
        bottom="0"
        left="0"
        right="0"
        bg="gray.900"
        borderTop="1px"
        borderColor="gray.800"
        display={{ base: "flex", md: "none" }}
        justifyContent="space-around"
        alignItems="center"
        px={2}
        py={2}
        zIndex={50}
        boxShadow="0 -2px 10px rgba(0,0,0,0.3)"
      >
        <Link to="/">
          <IconButton
            icon={<FaHome />}
            aria-label="Home"
            variant="ghost"
            colorScheme={isActive("/") || isActive("/home") ? "red" : "gray"}
            size="lg"
          />
        </Link>
        <Link to="/movies">
          <IconButton
            icon={<FaFilm />}
            aria-label="Movies"
            variant="ghost"
            colorScheme={isActive("/movies") ? "red" : "gray"}
            size="lg"
          />
        </Link>
        <Link to="/shows">
          <IconButton
            icon={<FaTv />}
            aria-label="TV Shows"
            variant="ghost"
            colorScheme={isActive("/shows") ? "red" : "gray"}
            size="lg"
          />
        </Link>
        <Link to="/history">
          <IconButton
            icon={<FaSearch />}
            aria-label="Search"
            variant="ghost"
            colorScheme={isActive("/history") ? "red" : "gray"}
            size="lg"
          />
        </Link>
        <IconButton
          icon={<FaBars />}
          aria-label="Menu"
          onClick={toggleSidebar}
          variant="ghost"
          colorScheme="gray"
          size="lg"
        />
      </Box>

      {/* Mobile Overlay */}
      <MobileOverlay />

      {/* Desktop Sidebar / Mobile Drawer */}
      <Box
        position="fixed"
        top="0"
        left="0"
        h="100vh"
        w={{ base: "280px", md: "240px" }}
        bg="gray.900"
        transform={{
          base: isOpen ? "translateX(0)" : "translateX(-100%)",
          md: "translateX(0)",
        }}
        transition="transform 0.3s ease-in-out"
        zIndex={60}
        boxShadow="2xl"
        overflowY="auto"
        className="scrollbar-hide"
      >
        {/* Logo */}
        <Flex
          justify="space-between"
          align="center"
          px={4}
          py={6}
          borderBottom="1px"
          borderColor="gray.800"
        >
          <Text fontSize="2xl" fontWeight="bold" color="red.500">
            FilmVault
          </Text>
          <IconButton
            icon={<FaTimes />}
            aria-label="Close menu"
            onClick={toggleSidebar}
            variant="ghost"
            colorScheme="gray"
            display={{ base: "flex", md: "none" }}
          />
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

          {isAuthenticated && (
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
          )}
        </Box>

        {isAuthenticated && (
          <>
            <Divider />

            {/* My Lists Section */}
            <Box px={4} py={4}>
              <Text fontWeight="bold" mb={2} color="gray.300">
                MY LISTS
              </Text>
              {watchlist && watchlist.length > 0 ? (
                <Box>
                  {watchlist.map((list: Watchlist) => (
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
            </Box>
          </>
        )}

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
                <Avatar size="sm" name={user?.username} mr={3} />
                <Box>
                  <Text fontSize="sm" fontWeight="medium" color="white">
                    {user?.username}
                  </Text>
                  <Text fontSize="xs" color="gray.400">
                    {user?.email}
                  </Text>
                </Box>
              </Flex>
            </Box>
          )}

          {isAuthenticated && (
            <Button
              colorScheme="red"
              variant="outline"
              width="100%"
              onClick={() => setLogoutModalOpen(true)}
            >
              Logout
            </Button>
          )}

          <LogoutModal
            isOpen={logoutModalOpen}
            onClose={() => setLogoutModalOpen(false)}
            onConfirm={handleLogout}
          />
        </Box>
      </Box>


    </>
  );
};

export default Navbar;
