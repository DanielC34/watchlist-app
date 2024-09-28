const Watchlist = require("../models/Watchlist");

exports.createWatchlist = async (req, res) => {
  try {
    //Extract user ID
    const userId = req.user.id;
    if (!userId) {
      return res.status(401).json({message: "Authorization Required"});
    }

    //Validate the request body
    const { watchlistName } = req.body;
    if (!watchlistName || watchlistName.trim() === "") {
      return res.status(400).json({ message: "Watchlist name is required." });
    }
    
    //Create a new watchlist instance
    const newWatchlist = new Watchlist({
      userId: userId,
      name: watchlistName,
      items: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    //Save the new watchlist instance to the database
    await newWatchlist.save();
    return res.status(201).json(newWatchlist);

  } catch (err) {
    console.error(err);
    //Catch any other errors
    console1004.REST.
  }
}

//Function to get watchlist from database
exports.getWatchlist = async (req, res) => {
  const userId = req.user.id; // Extract the user ID from the request object to find user's desired watchlist
  try {
    const watchlist = await Watchlist.findOne({ userId }); // Fetch the watchlist for the given user ID from the database
    res.json(watchlist); // Send the retrieved watchlist as a JSON response
  } catch (err) {
    res.status(500).json({ error: "Server error" }); //Handle any errors that occur during the database query
  }
};

// Add an item to the watchlist
exports.addToWatchlist = async (req, res) => {
  try {
    //Check if item already exists in user's watchlist by searching with userId and movieId
    const existingItem = await Watchlist.findOne({ userId: req.userId, movieId: req.movieId });
    
    //Returns error message if item already exists in user's watchlist
    if (existingItem) {
      return res.status(400).json({ message: 'Item already in watchlist' });
    }
    
    //Otherwise, create a new watchlist item with the details provided in the request
    const newWatchlistItem = new Watchlist({
      userId: req.userId,
      movieId: req.movieId,
      title: req.title,
      type: req.type,
      poster: req.poster,
      releaseDate: req.releaseDate,
      overview: req.overview
    });
    
    //Save the new watchlist item to the database
    await newWatchlistItem.save();
    
    //Respond with a 201 status and newly created watchlist item
    res.status(201).json(newWatchlistItem);
  } catch (error) {
    res.status(500).json({ message: "Failed to add to watchlist", error }); // If there is an error during the process, respond with a 500 status and an error message
  }
};

// Delete an item from the watchlist
exports.removeWatchlist = async (req, res) => {
  const { movieId, type } = req.body;
  const userId = req.user.id;
  try {
    let updateQuery;
    if (type === 'movie') {
      updateQuery = { $pull: { movies: movieId } };
    } else if (type === 'tv') {
      updateQuery = { $pull: { tvShows: movieId } };
    } else {
      return res.status(400).json({ message: 'Invalid type' });
    }
    const result = await Watchlist.findOneAndUpdate(
      { user: userId },
      updateQuery,
      { new: true }
    );
    if (!result) {
      return res.status(404).json({ message: 'Item not found in watchlist' });
    }
    res.status(200).json({ message: 'Item removed from watchlist', result });
  } catch (error) {
    res.status(500).json({ message: 'Failed to remove from watchlist', error });
  }
};
