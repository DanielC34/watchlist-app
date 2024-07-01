import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { Divider, IconButton } from "@chakra-ui/react";
import { FaHome, FaHistory, FaFilm, FaTv, FaPlus, FaTimes, FaBars } from "react-icons/fa";
import Profile from '../pages/profile/Profile';
import SearchInput from '../components/SearchInput';
import { Button } from '@chakra-ui/react';

const Navbar = () => {

  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
    document.body.classList.toggle('overflow-hidden');
  };

  return (
    <>
      {/*Overlay */}
      {/* <div
        className={`fixed inset-0 bg-gray-800 bg-opacity-75 z-40 md:hidden ${
          isOpen ? "block" : "hidden"
        }`}
        onClick={toggleSidebar}
      ></div> */}

      {/*Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0 transition-transform duration-200 ease-in-out bg-gray-800 p-4 flex flex-col space-y-4 z-50 w-64`}
      >
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-red-500">FilmVault</div>
          <IconButton
            aria-label="Close Menu"
            icon={<FaTimes />}
            className="md:hidden"
            onClick={toggleSidebar}
          />
        </div>
        <nav className="flex-1 flex flex-col space-y-2">
          <SearchInput />
          <Link to="/" className="flex items-center space-x-2">
            <FaHome />
            <span>Home</span>
          </Link>
          <Link to="/movies" className="flex items-center space-x-2">
            <FaFilm />
            <span>Movies</span>
          </Link>
          <Link to="/shows" className="flex items-center space-x-2">
            <FaTv />
            <span>TV Shows</span>
          </Link>
          <Link to="/history" className="flex items-center space-x-2">
            <FaHistory />
            <span>History</span>
          </Link>
          <Link to="/watchlist">
            <Button colorScheme="red" variant="solid">
              + Create Watchlist
            </Button>
          </Link>
          <Divider orientation="horizontal" />
          <h3>My Lists</h3>
        </nav>
        <div className="mt-auto text-center">
          <Button colorScheme="red" variant="solid">
            <Link to="/login">Login</Link>
          </Button>
        </div>
      </div>
      {/* Menu Button */}
      {/* <IconButton
        aria-label="Open Menu"
        icon={<FaBars />}
        className="fixed top-4 left-4 md:hidden z-50"
        onClick={toggleSidebar}
      /> */}
    </>
  );
}

export default Navbar