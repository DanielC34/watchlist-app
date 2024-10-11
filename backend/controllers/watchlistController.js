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
    console.error(err);
    return res.status(500).json({message: "An unexpected error occurred"});
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

// Function to Add an item to the watchlist
exports.addItemToWatchlist = async (req, res) => {
  try {
    //  Extract user ID (assuming authentication middleware has set req.user)
    const userId = req.user.id;
    // Check if user is authorized, else return unauthorized error
    if (!userId) {
      return res.status(401).json({ message: "Authorization Required" });
    }

    // Extract watchlistId and item from request body
    const { watchlistId, item } = req.body;
    //Check if both watchlistId and item are provided
    if (!watchlistId || !item) {
      return res
        .status(400)
        .json({ message: "Watchlist ID and item are required" });
    }

    // Find the watchlist that belongs to the user
    const watchlist = await Watchlist.findOne({
      _id: watchlistId,
      userId: userId,
    });
    //If watchlist is not found, return a 404 error
    if (!watchlist) {
      return res.status(404).json({ message: "Watchlist not found" });
    }

    // Check if the item already exists in the watchlist to avoid duplication
    const itemExists = watchlist.items.some(
      (watchlistItem) => watchlistItem.id === item.id
    );
    //If item exists return conflict error
    if (itemExists) {
      return res
        .status(409)
        .json({ message: "Item already exists in the watchlist" });
    }

    // If item doesn't exist, add it to the watchlist's items array
    watchlist.items.push(item);
    // Update the updatedAt field to reflect the modification
    watchlist.updatedAt = new Date();

    // Save the updated watchlist
    await watchlist.save();

    // Return success response
    return res.status(200).json({
      message: "Item added to watchlist successfully",
      watchlist,
    });
  } catch (error) {
    console.log(error);
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
