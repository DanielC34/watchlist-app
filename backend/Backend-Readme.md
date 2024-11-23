# Backend
The backend of the movie watchlist application is developed using Node.js, Express, and MongoDB. It is responsible for managing user authentication, movie/TV show search, and watchlist functionality.

# Files and Components
Controllers
controllers/authController.js

Handles user registration, login, and logout.
Implements JWT authentication for securing routes.
controllers/watchlistController.js

createWatchlist: Creates a new watchlist for the user.
getWatchlist: Retrieves the user's watchlists.
updateWatchlist: Updates the name of a user's watchlist.
deleteWatchlist: Deletes a user's watchlist.
addItemToWatchlist: Adds a movie or TV show item to a specific watchlist.
removeItemFromWatchlist: Removes a movie or TV show item from a specific watchlist.

# Middleware
middleware/authMiddleware.js
Protects routes by ensuring only authenticated users can access them.
Verifies the JWT token provided by the user.

# Models
models/User.js

Defines the User schema.
Includes fields for:
username (String)
email (String)
password (Hashed String)
models/Watchlist.js

Defines the Watchlist schema.
Includes fields for:
user (ObjectId referencing User)
name (String)
items (Array of movies or TV shows with fields for type, name, poster, and addedAt)

# Routes
routes/auth.js

POST /register: Registers a new user.
POST /login: Logs in a user and returns a JWT token.
POST /logout: Logs out a user by invalidating their session.
routes/watchlist.js

POST /api/watchlist/create: Creates a new watchlist for the user. (Protected route)
GET /api/watchlist: Retrieves all watchlists for the user. (Protected route)
PUT /api/watchlist/:id: Updates the name of a specific watchlist. (Protected route)
DELETE /api/watchlist/:id: Deletes a specific watchlist. (Protected route)
POST /api/watchlist/:id/item: Adds a movie or TV show item to a specific watchlist. (Protected route)
DELETE /api/watchlist/:id/item/:itemId: Removes a specific item from a watchlist. (Protected route)