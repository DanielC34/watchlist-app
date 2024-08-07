const Watchlist = require("../models/Watchlist");

//Function for fetching watchlist from database
exports.getWatchlist = async (req, res) => {
  const userId = req.user.id; // Extract the user ID from the request object to find user's desired watchlist
  try {
    const watchlist = await Watchlist.findOne({ userId }); // Fetch the watchlist for the given user ID from the database
    res.json(watchlist); // Send the retrieved watchlist as a JSON response
  } catch (err) {
    res.status(500).json({ error: "Server error" }); //Handle any errors that occur during the database query
  }
};

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

exports.removeFromWatchlist = async (req, res) => {
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
