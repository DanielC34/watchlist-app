const Watchlist = require("../models/Watchlist");

// Create a new watchlist
exports.createWatchlist = async (req, res) => {
  try {
    const { name, description } = req.body;

    // Basic validation
    if (!name) {
      return res.status(400).json({ message: "Watchlist name is required" });
    }

    // Create new watchlist
    const newWatchlist = new Watchlist({
      name,
      description,
      userId: req.user.id, // Assuming req.user is set by auth middleware
      items: [],
    });

    // Save to database
    const savedWatchlist = await newWatchlist.save();

    res.status(201).json(savedWatchlist);
  } catch (error) {
    console.error("Error creating watchlist:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all watchlists for a user
exports.getAllWatchlists = async (req, res) => {
  try {
    const watchlists = await Watchlist.find({ userId: req.user.id });
    res.json(watchlists);
  } catch (error) {
    console.error("Error fetching watchlists:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get a single watchlist by ID
exports.getWatchlistById = async (req, res) => {
  try {
    const watchlist = await Watchlist.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!watchlist) {
      return res.status(404).json({ message: "Watchlist not found" });
    }

    res.json(watchlist);
  } catch (error) {
    console.error("Error fetching watchlist:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update a watchlist
exports.updateWatchlist = async (req, res) => {
  try {
    const { name, description } = req.body;

    // Basic validation
    if (!name) {
      return res.status(400).json({ message: "Watchlist name is required" });
    }

    // Find and update the watchlist
    const updatedWatchlist = await Watchlist.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      {
        name,
        description,
        updatedAt: Date.now(),
      },
      { new: true }
    );

    if (!updatedWatchlist) {
      return res.status(404).json({ message: "Watchlist not found" });
    }

    res.json(updatedWatchlist);
  } catch (error) {
    console.error("Error updating watchlist:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a watchlist
exports.deleteWatchlist = async (req, res) => {
  try {
    const deletedWatchlist = await Watchlist.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!deletedWatchlist) {
      return res.status(404).json({ message: "Watchlist not found" });
    }

    res.json({ message: "Watchlist deleted successfully" });
  } catch (error) {
    console.error("Error deleting watchlist:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Add an item to a watchlist
exports.addItemToWatchlist = async (req, res) => {
  try {
    const { movieId, title, posterPath, mediaType, releaseDate } = req.body;

    // Basic validation
    if (!movieId || !title || !mediaType) {
      return res
        .status(400)
        .json({ message: "Movie ID, title, and media type are required" });
    }

    // Find the watchlist
    const watchlist = await Watchlist.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!watchlist) {
      return res.status(404).json({ message: "Watchlist not found" });
    }

    // Check if item already exists in watchlist
    const itemExists = watchlist.items.some(
      (item) => item.movieId === movieId && item.mediaType === mediaType
    );

    if (itemExists) {
      return res
        .status(400)
        .json({ message: "Item already exists in watchlist" });
    }

    // Add new item
    const newItem = {
      movieId,
      title,
      posterPath,
      mediaType,
      releaseDate,
      addedAt: Date.now(),
    };

    watchlist.items.push(newItem);
    watchlist.updatedAt = Date.now();

    await watchlist.save();

    res.status(201).json(newItem);
  } catch (error) {
    console.error("Error adding item to watchlist:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Remove an item from a watchlist
exports.removeItemFromWatchlist = async (req, res) => {
  try {
    const watchlist = await Watchlist.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!watchlist) {
      return res.status(404).json({ message: "Watchlist not found" });
    }

    // Find the item index
    const itemIndex = watchlist.items.findIndex(
      (item) => item._id.toString() === req.params.itemId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in watchlist" });
    }

    // Remove the item
    watchlist.items.splice(itemIndex, 1);
    watchlist.updatedAt = Date.now();

    await watchlist.save();

    res.json({ message: "Item removed from watchlist" });
  } catch (error) {
    console.error("Error removing item from watchlist:", error);
    res.status(500).json({ message: "Server error" });
  }
};
