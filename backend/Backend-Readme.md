# Backend

TThe backend of the movie watchlist application is developed using Node.js, Express, and MongoDB. It is responsible for managing user authentication, movie/TV show search, and watchlist functionality. 
 
## Files and Components 
 
### Controllers 
- **controllers/authController.js** 
  - Handles user registration, login, and logout. 
  - Implements JWT authentication for securing routes. 
 
- **controllers/watchlistController.js** 
  - **addToWatchlist:** Adds a movie or TV show to the user's watchlist. 
  - **getWatchlist:** Retrieves the user's watchlist. 
  - **removeFromWatchlist:** Removes a movie or TV show from the user's watchlist. 
 
### Middleware 
- **middleware/authMiddleware.js** 
  - Protects routes by ensuring that only authenticated users can access them. 
  - Verifies the JWT token provided by the user. 
 
### Models 
- **models/User.js** 
  - Defines the User schema. 
  - Includes fields for username, email, and password. 
 
- **models/Watchlist.js** 
  - Defines the Watchlist schema. 
  - Includes fields for user, movies, and tvShows. 
 
### Routes 
- **routes/auth.js** 
  - **POST /register:** Registers a new user. 
  - **POST /login:** Logs in a user and returns a JWT token. 
  - **POST /logout:** Logs out a user by invalidating their JWT token. 
 
- **routes/watchlist.js** 
  - **POST /api/watchlist:** Adds a movie or TV show to the user's watchlist. Protected route. 
  - **GET /api/watchlist:** Retrieves the user's watchlist. Protected route. 
  - **DELETE /api/watchlist:** Removes a movie or TV show from the user's watchlist. Protected route. 