import React from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore"; // Importing the custom hook for authentication
import { FaUser, FaList, FaSignOutAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

const DropDown = ({ onClose }) => {
  const navigate = useNavigate(); // Hook for navigation
  const { user, logout } = useAuthStore((state) => ({
    user: state.user, // User data from the store
    logout: state.logout, // Logout function from the store
  }));

  // Function to handle logout
  const handleLogout = () => {
    logout(); // Call the logout function
    navigate("/login"); // Redirect to the login page after logout
  };

  return (
    <div className="absolute right-0 mt-2 bg-gray-700 text-white rounded shadow-lg z-10">
      <ul>
        {/* Profile link */}
        <li>
          <Link
            to="/profile"
            className="block px-4 py-2 hover:bg-gray-600"
            onClick={onClose} // Close the dropdown on click
          >
            <FaUser className="inline mr-2" /> Profile
          </Link>
        </li>
        {/* My Watchlists link */}
        <li>
          <Link
            to="/watchlist"
            className="block px-4 py-2 hover:bg-gray-600"
            onClick={onClose} // Close the dropdown on click
          >
            <FaList className="inline mr-2" /> My Watchlists
          </Link>
        </li>
        {/* Logout button */}
        <li>
          <button
            className="w-full text-left px-4 py-2 hover:bg-gray-600"
            onClick={() => {
              // Handle logout and close dropdown
              handleLogout();
              onClose(); // Close the dropdown on logout
            }}
          >
            <FaSignOutAlt className="inline mr-2" /> Logout
          </button>
        </li>
      </ul>
    </div>
  );
};

export default DropDown;
