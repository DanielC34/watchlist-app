import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Header from "./components/Header";

function App() {
  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <Navbar />
      <div className="flex-1 flex flex-col">
        <Header />
        <div className="p-4 flex flex-col space-y-4 bg-gray-900 text-white">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default App;
