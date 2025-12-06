import { useState, useEffect, ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Divider, IconButton, Box, Text, Flex, Avatar, Button, VStack, useColorModeValue } from "@chakra-ui/react";
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

  const borderColor = useColorModeValue("gray.200", "gray.700");
  const mobileNavBg = useColorModeValue("white", "dark.bg");

  useEffect(() => {
    if (isAuthenticated) {
      getWatchlist();
    }
  }, [isAuthenticated, getWatchlist]);

  // Close sidebar when route changes
  useEffect(() => {
    setIsOpen(false);
    document.body.style.overflow = "auto";
  }, [location]);

  const toggleSidebar = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    document.body.style.overflow = newState ? "hidden" : "auto";
  };

  const handleLogout = () => {
    logout();
    setLogoutModalOpen(false);
    navigate("/");
  };

  const isActive = (path: string): boolean => {
    return location.pathname === path;
  };

  const NavLink = ({ to, icon, children }: NavLinkProps) => {
    const active = isActive(to);
    return (
      <Link to={to} style={{ width: "100%" }}>
        <Flex
          align="center"
          py={3}
          px={4}
          borderRadius="lg"
          bg={active ? "brand.500" : "transparent"}
          color={active ? "white" : "gray.400"}
          _hover={{ bg: active ? "brand.600" : "whiteAlpha.100", color: active ? "white" : "white" }}
          transition="all 0.2s"
          mb={1}
        >
          <Box mr={3} fontSize="lg">{icon}</Box>
          <Text fontWeight={active ? "semibold" : "medium"}>{children}</Text>
        </Flex>
      </Link>
    );
  };

  const MobileOverlay = () => (
    <Box
      display={{ base: isOpen ? "block" : "none", md: "none" }}
      position="fixed"
      top={0}
      left={0}
      right={0}
      bottom={0}
      bg="blackAlpha.700"
      zIndex={40}
      onClick={toggleSidebar}
      backdropFilter="blur(2px)"
    />
  );

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <Flex
        position="fixed"
        bottom="0"
        left="0"
        right="0"
        bg={mobileNavBg}
        borderTop="1px"
        borderColor={borderColor}
        display={{ base: "flex", md: "none" }}
        justify="space-around"
        align="center"
        px={2}
        py={3}
        zIndex={50}
        boxShadow="0 -4px 20px rgba(0,0,0,0.2)"
      >
        <Link to="/">
          <IconButton
            icon={<FaHome />}
            aria-label="Home"
            variant="ghost"
            colorScheme={isActive("/") || isActive("/home") ? "brand" : "gray"}
            size="lg"
            isRound
          />
        </Link>
        <Link to="/movies">
          <IconButton
            icon={<FaFilm />}
            aria-label="Movies"
            variant="ghost"
            colorScheme={isActive("/movies") ? "brand" : "gray"}
            size="lg"
            isRound
          />
        </Link>
        <Link to="/shows">
          <IconButton
            icon={<FaTv />}
            aria-label="TV Shows"
            variant="ghost"
            colorScheme={isActive("/shows") ? "brand" : "gray"}
            size="lg"
            isRound
          />
        </Link>
        <Link to="/history">
          <IconButton
            icon={<FaSearch />}
            aria-label="Search"
            variant="ghost"
            colorScheme={isActive("/history") ? "brand" : "gray"}
            size="lg"
            isRound
          />
        </Link>
        <IconButton
          icon={<FaBars />}
          aria-label="Menu"
          onClick={toggleSidebar}
          variant="ghost"
          colorScheme="gray"
          size="lg"
          isRound
        />
      </Flex>

      <MobileOverlay />

      {/* Desktop Sidebar / Mobile Drawer */}
      <Box
        position="fixed"
        top="0"
        left="0"
        h="100vh"
        w={{ base: "280px", md: "240px" }}
        bg="dark.card"
        transform={{
          base: isOpen ? "translateX(0)" : "translateX(-100%)",
          md: "translateX(0)",
        }}
        transition="transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
        zIndex={60}
        borderRight="1px"
        borderColor="whiteAlpha.100"
        overflowY="auto"
        css={{
          "&::-webkit-scrollbar": { display: "none" },
          msOverflowStyle: "none",
          scrollbarWidth: "none",
        }}
      >
        {/* Logo */}
        <Flex
          justify="space-between"
          align="center"
          px={6}
          py={8}
        >
          <Text fontSize="2xl" fontWeight="900" letterSpacing="tight" bgGradient="linear(to-r, brand.400, accent.500)" bgClip="text">
            FilmVault
          </Text>
          <IconButton
            icon={<FaTimes />}
            aria-label="Close menu"
            onClick={toggleSidebar}
            variant="ghost"
            colorScheme="whiteAlpha"
            display={{ base: "flex", md: "none" }}
            size="sm"
          />
        </Flex>

        {/* Navigation Links */}
        <Box px={4} mb={6}>
          <VStack spacing={1} align="stretch">
            <NavLink to="/" icon={<FaHome />}>Home</NavLink>
            <NavLink to="/movies" icon={<FaFilm />}>Movies</NavLink>
            <NavLink to="/shows" icon={<FaTv />}>TV Shows</NavLink>
            <NavLink to="/history" icon={<FaSearch />}>Search</NavLink>
            <NavLink to="/feed" icon={<FaSearch />}>Social Feed</NavLink>
            <NavLink to="/discover" icon={<FaSearch />}>Discover Users</NavLink>
          </VStack>

          {isAuthenticated && (
            <Box mt={8}>
              <Link to="/create-watchlist">
                <Button
                  leftIcon={<FaPlus />}
                  colorScheme="brand"
                  variant="solid"
                  size="md"
                  width="100%"
                  borderRadius="lg"
                  boxShadow="lg"
                  _hover={{ transform: "translateY(-2px)", boxShadow: "xl" }}
                >
                  Create Watchlist
                </Button>
              </Link>
            </Box>
          )}
        </Box>

        {isAuthenticated && (
          <>
            <Box px={6} py={2}>
              <Divider borderColor="whiteAlpha.200" />
            </Box>

            {/* My Lists Section */}
            <Box px={4} py={4}>
              <Text fontWeight="bold" fontSize="xs" letterSpacing="wider" mb={4} color="gray.500" textTransform="uppercase">
                My Lists
              </Text>
              {watchlist && watchlist.length > 0 ? (
                <VStack spacing={1} align="stretch">
                  {watchlist.map((list: Watchlist) => (
                    <Link key={list._id} to={`/watchlist/${list._id}`}>
                      <Flex
                        py={2}
                        px={4}
                        borderRadius="md"
                        _hover={{
                          bg: "whiteAlpha.100",
                          color: "brand.300",
                        }}
                        transition="all 0.2s"
                        align="center"
                        color="gray.400"
                      >
                        <Text fontSize="sm" noOfLines={1} fontWeight="medium">
                          {list.name}
                        </Text>
                      </Flex>
                    </Link>
                  ))}
                </VStack>
              ) : (
                <Text fontSize="sm" color="gray.500" fontStyle="italic" px={2}>
                  No watchlists yet
                </Text>
              )}
            </Box>
          </>
        )}

        {/* Footer with User Profile */}
        <Box px={4} mt="auto" pb={6} position="sticky" bottom="0" bg="dark.card">
          <Box px={2} py={2}>
            <Divider borderColor="whiteAlpha.200" mb={4} />
          </Box>

          {isAuthenticated && (
            <Box
              p={3}
              borderRadius="xl"
              bg="whiteAlpha.50"
              mb={4}
              cursor="pointer"
              onClick={() => navigate(`/profile/${user?._id}`)}
              _hover={{ bg: "whiteAlpha.100" }}
              transition="all 0.2s"
              border="1px"
              borderColor="whiteAlpha.100"
            >
              <Flex align="center">
                <Avatar size="sm" name={user?.username} mr={3} bg="brand.500" />
                <Box overflow="hidden">
                  <Text fontSize="sm" fontWeight="bold" color="white" isTruncated>
                    {user?.username}
                  </Text>
                  <Text fontSize="xs" color="gray.400" isTruncated>
                    {user?.email}
                  </Text>
                </Box>
              </Flex>
            </Box>
          )}

          {isAuthenticated && (
            <Button
              colorScheme="red"
              variant="ghost"
              width="100%"
              size="sm"
              onClick={() => setLogoutModalOpen(true)}
              _hover={{ bg: "red.500", color: "white" }}
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
