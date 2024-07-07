import React from 'react'

const Header = () => {
  return (
    <header className="bg-gray-800 p-4 text-center">
      <h1 className="text-2xl font-bold">Welcome to FilmVault!!</h1>
      <p>
        Browse movies and TV Shows to add them to watchlists to watch later.
        <br />
        Just click the <span className="text-red-500">+</span> to add a movie to
        watchlist, the poster to see more details or{" "}
        <span className="text-red-500">✔</span> to mark the movie as watched.
      </p>
    </header>
  );
}

export default Header