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
    <div className="flex min-h-screen bg-gray-950">
      {/* Sidebar Navigation */}
      <Navbar />
      
      {/* Main content area */}
      <main className="flex-1 pb-20 md:pb-0 md:ml-60">
        <Header />
        
        {/* Content Area with max width for better readability */}
        <div className="px-4 py-6 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default App;
