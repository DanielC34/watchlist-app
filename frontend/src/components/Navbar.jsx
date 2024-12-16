import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { Divider, IconButton } from "@chakra-ui/react";
import { FaHome, FaHistory, FaFilm, FaTv, FaPlus, FaTimes, FaBars } from "react-icons/fa";
import { Button } from '@chakra-ui/react';

const Navbar = () => {

  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
    document.body.classList.toggle('overflow-hidden');
  };

  return (
    <>
      {/* Toggle Button for Small Screens */}
      <div className="md:hidden flex items-center p-4 bg-gray-800 z-50">
        <IconButton
          aria-label={isOpen ? "Close Menu" : "Open Menu"}
          icon={isOpen ? <FaTimes /> : <FaBars />}
          onClick={toggleSidebar}
          className="text-white"
        />
      </div>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0 transition-transform duration-200 ease-in-out bg-gray-800 p-4 flex flex-col space-y-4 z-50 w-64`}
      >
        {/* Header with Brand and Close Button */}
        <div className="flex items-center justify-between md:hidden">
          <div className="text-2xl font-bold text-red-500">FilmVault</div>
          <IconButton
            aria-label="Close Menu"
            icon={<FaTimes />}
            className="text-white"
            onClick={toggleSidebar}
          />
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 flex flex-col space-y-2 mt-4 md:mt-0">
          <Link to="/" className="flex items-center space-x-2 text-white">
            <FaHome />
            <span>Home</span>
          </Link>
          <Link to="/movies" className="flex items-center space-x-2 text-white">
            <FaFilm />
            <span>Movies</span>
          </Link>
          <Link to="/shows" className="flex items-center space-x-2 text-white">
            <FaTv />
            <span>TV Shows</span>
          </Link>
          <Link
            to="/history"
            className="flex items-center space-x-2 text-white"
          >
            <FaHistory />
            <span>History</span>
          </Link>
          <Link to="/create-watchlist">
            <Button
              colorScheme="red"
              variant="solid"
              className="w-full text-white"
            >
              + Create Watchlist
            </Button>
          </Link>
          <Divider orientation="horizontal" />
          <h3 className="text-white">My Lists</h3>
          <Link to="/createlist">
            <span>{/* Add other details here if needed */}</span>
          </Link>
        </nav>

        {/* Footer with Login Button */}
        <div className="mt-auto text-center">
          <Button colorScheme="red" variant="solid">
            <Link to="/login">Login</Link>
          </Button>
        </div>
      </div>
    </>
  );
}

export default Navbar