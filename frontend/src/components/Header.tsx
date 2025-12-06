import { useNavigate } from "react-router-dom";
import { Button, Flex, Avatar, Menu, MenuButton, MenuList, MenuItem, Box, Text, Heading, useColorModeValue } from "@chakra-ui/react";
import useAuthStore from "../store/useAuthStore";
import { FaUser, FaList, FaSignOutAlt } from "react-icons/fa";

const Header = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const bg = useColorModeValue("white", "rgba(20, 24, 28, 0.8)");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");

  return (
    <Box
      as="header"
      position="sticky"
      top="0"
      zIndex="10"
      bg={bg}
      backdropFilter="blur(12px)"
      borderBottom="1px"
      borderColor={borderColor}
      transition="all 0.2s"
    >
      <Box maxW="7xl" mx="auto" px={4} py={4}>
        <Flex justify="space-between" align="center">
          <Box>
            <Heading as="h1" size="md" fontWeight="bold" letterSpacing="tight">
              <Text as="span" bgGradient="linear(to-r, brand.400, accent.500)" bgClip="text">
                FilmVault
              </Text>
            </Heading>
            <Text fontSize="xs" color="gray.400" mt={1} fontWeight="medium">
              Track films and TV shows you want to watch
            </Text>
          </Box>

          <Box display={{ base: "none", md: "block" }}>
            {isAuthenticated ? (
              <Menu>
                <MenuButton>
                  <Flex align="center" gap={3} cursor="pointer" _hover={{ opacity: 0.8 }} p={1} borderRadius="full">
                    <Avatar size="sm" name={user.username} bg="brand.500" />
                    <Text fontSize="sm" fontWeight="medium" color="gray.300">{user.username}</Text>
                  </Flex>
                </MenuButton>
                <MenuList bg="dark.card" borderColor="whiteAlpha.200" boxShadow="xl">
                  <MenuItem icon={<FaUser />} onClick={() => navigate("/profile")} bg="transparent" _hover={{ bg: "whiteAlpha.100" }}>
                    Profile
                  </MenuItem>
                  <MenuItem icon={<FaList />} onClick={() => navigate("/watchlist")} bg="transparent" _hover={{ bg: "whiteAlpha.100" }}>
                    My Watchlists
                  </MenuItem>
                  <MenuItem icon={<FaSignOutAlt />} onClick={handleLogout} bg="transparent" _hover={{ bg: "red.500", color: "white" }} color="red.400">
                    Logout
                  </MenuItem>
                </MenuList>
              </Menu>
            ) : (
              <Button
                colorScheme="brand"
                size="sm"
                onClick={() => navigate("/profile")}
                borderRadius="full"
                px={6}
              >
                Login / Sign Up
              </Button>
            )}
          </Box>
        </Flex>
      </Box>
    </Box>
  );
};

export default Header;
