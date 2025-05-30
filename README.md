# FilmVault - Movie Watchlist

FilmVault is a modern movie and TV show watchlist application that lets users discover, save, and manage their favorite content. Built with React.js, Chakra UI, and TailwindCSS, it provides a seamless and interactive user experience with robust authentication and watchlist management.

---

## 🚀 Features

### User Authentication
- **Sign Up**: Create an account to start building your watchlists.
- **Log In**: Access your personalized watchlists securely.
- **Protected Routes**: Only authenticated users can manage watchlists and personal data.
- **Logout**: Securely log out to protect your data.

### Movie & TV Show Discovery
- **Search Bar**: Search for movies and TV shows by title.
- **Filter Options**: Filter by trending, top rated, day/week, and type (movie or TV show).
- **Pagination**: Efficiently browse large sets of results.

### Watchlist Management
- **Create Watchlist**: Organize your favorites into multiple watchlists.
- **Add to Multiple Watchlists**: Add a movie or show to one or more watchlists at once.
- **Remove from Watchlist**: Remove items you no longer wish to keep.
- **Delete Watchlist**: Remove entire watchlists.
- **Edit Watchlist**: Rename or update your watchlist details.
- **Persistent Storage**: Your watchlists are synced and saved across sessions.
- **No Duplicate Items**: Prevents adding the same item twice to a watchlist.

### Watchlist Item Features
- **Mark as Watched**: See which items you’ve watched with a bookmark icon.
- **Remove Item**: Instantly remove an item from any watchlist.
- **Seamless Loading**: Loading modals and spinners for smooth transitions.
- **Error Handling**: Friendly error messages and toasts for all watchlist operations.

### Movie/TV Show Details
- **Detailed Information**: View synopsis, cast, crew, and ratings.
- **Related Content**: Discover similar movies and TV shows.
- **Watch Trailer**: Watch trailers directly in the app.
- **Ratings and Reviews**: Read user reviews and see average ratings.

### User Profile
- **Profile Page**: View your info and all your watchlists in one place.
- **Quick Navigation**: Click any watchlist to view its details.

---

## 🛠️ Technologies Used

- **Frontend**: React.js, Chakra UI, TailwindCSS, React Router, Axios
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Authentication**: JWT
- **Hosting**: Vercel/Netlify (frontend)

---

## 🎬 API Used

- **The Movie DB**: Provides up-to-date data on movies, TV shows, actors, and ratings.

---

## 🏗️ Installation

To run this project locally:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/DanielC34/movie-watchlist.git
   cd movie-watchlist
   ```

2. **Frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Backend**
   ```bash
   cd ../backend
   npm install
   npm run dev
   ```

---

## 🤝 Contribution

Please fork the repository and create a pull request with your feature or bug fix.

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🙏 Acknowledgements

- TMDB API for providing movie/TV show data.
- React, Chakra UI, and TailwindCSS for their awesome tools and frameworks.

---
