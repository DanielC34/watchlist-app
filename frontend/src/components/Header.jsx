import React, { useState, useRef, useEffect } from "react";
import useAuthStore from '../store/useAuthStore';
import { Avatar } from "@chakra-ui/react";
import { FaCaretDown } from "react-icons/fa";
import DropDownMenu from "../components/DropDown";

const Header = () => {

    // State to manage dropdown visibility
  const [showDropdown, setShowDropdown] = useState(false);

  // Access authentication state and user info from Zustand
  const { isAuthenticated, user } = useAuthStore((state) => ({
    isAuthenticated: state.isAuthenticated,
    user: state.user,
  }));


  // Toggle dropdown visibility
  const toggleDropdown = () => {
    console.log("Dropdown toggled", !showDropdown);
    setShowDropdown(!showDropdown);
  };

  return (
    <header className="bg-gray-800 p-4 text-center">
      <div className="justify-center">
        <h1 className="text-2xl font-bold">Welcome to FilmVault!!</h1>

        <p>
          Browse movies and TV Shows to add them to watchlists to watch later.
          <br />
          Just click the <span className="text-red-500">+</span> to add a movie
          to watchlist, the poster to see more details or{" "}
          <span className="text-red-500">✔</span> to mark the movie as watched.
        </p>
      </div>

      {/* Profile icon and dropdown */}
      {/* Render profile icon and dropdown if user is logged in */}
      {isAuthenticated && (
        <div
          className="flex justify-end items-center relative cursor-pointer"
          onClick={toggleDropdown}
          style={{ marginRight: "1px" }}
        >
          <Avatar
            name={user.username}
            src="https://bit.ly/broken-link" // Add the actual image source here
            borderColor="white" // Set the border color to white
            borderWidth="thin" // Set the border width to thin
            className="profile-icon"
          />
          <FaCaretDown className="text-white ml-2" /> {/* Dropdown arrow */}
          {/* Render dropdown menu based on showDropdown state */}
          {showDropdown && (
            <DropDownMenu
              onClose={() => setShowDropdown(false)}
              className="absolute right-0 mt-2 bg-gray-800 text-white shadow-lg rounded-md w-48"
            />
          )}
        </div>
      )}
    </header>
  );
}

export default Header