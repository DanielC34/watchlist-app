import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Header from "./components/Header";
import useAuthStore from "./store/useAuthStore.jsx";

function App() {
  const checkAuthOnLoad = useAuthStore((state) => state.checkAuthOnLoad);

  useEffect(() => {
    checkAuthOnLoad();
  }, []);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-900 text-white">
      {/* Sidebar - fixed width on desktop, collapsible on mobile */}
      <div className="md:w-64 md:flex-shrink-0">
        <Navbar />
      </div>

      {/* Main content area */}
      <div className="flex-1 overflow-auto">
        <Header />

        {/* Content Area */}
        <div className="p-4 bg-gray-900 text-white">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default App;
