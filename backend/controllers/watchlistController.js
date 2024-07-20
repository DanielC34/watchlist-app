const Watchlist = require("../models/Watchlist");

exports.getWatchlist = async (req, res) => {
  const userId = req.user.id;
  try {
    const watchlist = await Watchlist.findOne({ userId });
    res.json(watchlist);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.addToWatchlist = async (req, res) => {
  try {
    const existingItem = await Watchlist.findOne({ userId: req.userId, movieId: req.movieId });
    
    if (existingItem) {
      return res.status(400).json({ message: 'Item already in watchlist' });
    }
    
    const newWatchlistItem = new Watchlist({
      userId: req.userId,
      movieId: req.movieId,
      title: req.title,
      type: req.type,
      poster: req.poster,
      releaseDate: req.releaseDate,
      overview: req.overview
    });
    
    await newWatchlistItem.save();
    
    res.status(201).json(newWatchlistItem);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add to watchlist', error });
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
