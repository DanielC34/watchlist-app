import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Box, Flex } from "@chakra-ui/react";
import Navbar from "./components/Navbar";
import Header from "./components/Header";
import useAuthStore from "./store/useAuthStore";

function App() {
  const checkAuthOnLoad = useAuthStore((state) => state.checkAuthOnLoad);

  useEffect(() => {
    checkAuthOnLoad();
  }, [checkAuthOnLoad]);

  return (
    <Flex minH="100vh" bg="dark.bg" color="dark.text">
      <Navbar />

      <Box flex="1" pb={{ base: 20, md: 0 }} ml={{ base: 0, md: "240px" }} transition="margin-left 0.3s">
        <Header />

        <Box px={4} py={6} maxW="7xl" mx="auto">
          <Outlet />
        </Box>
      </Box>
    </Flex>
  );
}

export default App;
