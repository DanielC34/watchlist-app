import React from "react";

const Header = () => {
  return (
    <header className="bg-gray-800 p-4 text-center">
      <div className="justify-center">
        <h1 className="text-2xl font-bold text-red-600">FilmVault</h1>

        <p>
          Browse movies and TV Shows to add them to watchlists to watch later.
        </p>
      </div>

      {/* Profile icon and dropdown */}
      {/* Render profile icon and dropdown if user is logged in */}
    </header>
  );
}

export default Header