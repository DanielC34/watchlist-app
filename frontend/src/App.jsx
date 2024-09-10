import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Header from "./components/Header";
import useAuthStore from "./store/useAuthStore.jsx";

function App() {
  const checkAuthOnLoad = useAuthStore((state) => state.checkAuthOnLoad); // Access the checkAuthOnLoad function

  // Run this code when the app first loads
  useEffect(() => {
    checkAuthOnLoad(); // Check if the user is already logged in
  }, []); // Empty dependency array means this runs only once on load

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Navbar is hidden on small screens by default */}
      <Navbar />

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-auto">
        <Header />

        {/* Content Area */}
        <div className="p-4 flex flex-col space-y-4 bg-gray-900 text-white">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default App;
