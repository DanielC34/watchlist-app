import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { Divider } from "@chakra-ui/react";
import { FaHome, FaHistory, FaFilm, FaTv, FaPlus } from "react-icons/fa";
import Profile from '../pages/profile/Profile';
import SearchInput from '../components/SearchInput';
import { Button } from '@chakra-ui/react';

const Navbar = () => {

  const [open, setOpen] = useState(true);

    return (
      <div className="h-screen w-64 p-4 flex flex-col space-y-4">
        <div className="text-2xl font-bold text-red-500">FilmVault</div>
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
          <Divider orientation="horizontal" />
          <Button colorScheme="red" variant="solid">
            Create Watchlist
          </Button>
        </nav>
        <div className="mt-auto text-center">
          <Button colorScheme="red" variant="solid">
            <Link to="/login">Login</Link>
          </Button>
        </div>
      </div>
    );
}

export default Navbar