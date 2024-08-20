import React from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../store/useAuthStore'
import { FaUser, FaList, FaSignOutAlt } from "react-icons/fa";
import { Link } from 'react-router-dom';

const DropDown = ({ onClose }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore((state) => ({
    user: state.user,
    logout: state.logout,
  }));

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // if (!isOpen) return null;

  return (
    <div className="absolute right-0 mt-2 bg-gray-700 text-white rounded shadow-lg z-10">
      <ul>
        <li>
          <Link
            to="/profile"
            className="block px-4 py-2 hover:bg-gray-600"
            onClick={onClose}
          >
            Profile
          </Link>
        </li>
        <li>
          <Link
            to="/watchlist"
            className="block px-4 py-2 hover:bg-gray-600"
            onClick={onClose}
          >
            My Watchlists
          </Link>
        </li>
        <li>
          <button
            className="w-full text-left px-4 py-2 hover:bg-gray-600"
            onClick={onClose}
          >
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
};

export default DropDown