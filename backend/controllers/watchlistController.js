const Watchlist = require("../models/Watchlist");

exports.createWatchlist = async (req, res) => {
  try {
    //Extract user ID
    const userId = req.user.id;
    if (!userId) {
      return res.status(401).json({ message: "Authorization Required" });
    }

    //Validate the request body
    const { watchlistName } = req.body;
    if (!watchlistName || watchlistName.trim() === "") {
      return res.status(400).json({ message: "Watchlist name is required." });
    }

    //Create a new watchlist instance
    const newWatchlist = new Watchlist({
      user: userId,
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
    return res.status(500).json({ message: "An unexpected error occurred" });
  }
};

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
    if (!userId) {
      return res.status(401).json({ message: "Authorization Required" });
    }

    // Extract watchlistId and item from request body and check if both watchlistId and item are provided
    const { watchlistId, item } = req.body;
    if (!watchlistId || !item) {
      return res
        .status(400)
        .json({ message: "Watchlist ID and item are required" });
    }

    // Find the watchlist that belongs to the user. If watchlist is not found, return a 404 error
    const watchlist = await Watchlist.findOne({
      _id: watchlistId,
      userId: userId,
    });
    if (!watchlist) {
      return res.status(404).json({ message: "Watchlist not found" });
    }

    // Check if the item already exists in the watchlist to avoid duplication. Returns error if item exists already
    const itemExists = watchlist.items.some(
      (watchlistItem) => watchlistItem.id === item.id
    );
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

//Update an existing watchlist
exports.updateWatchlist = async (req, res) => {
  try {
    //  Extract user ID (assuming authentication middleware has set req.user), otherwise returns error if user is not authenticated
    const userId = req.user.id;
    if (!userId) {
      return res.status(401).json({ message: "Authorization Required" });
    }

    const { watchlistId, newWatchlistName } = req.body;

    //Check if both watchlistId and newWatchlistName are provided
    if (!watchlistId || !newWatchlistName || newWatchlistName.trim() === "") {
      return res
        .status(400)
        .json({ message: "Watchlist ID and new name are required" });
    }

    //Find the watchlist that belongs to the user
    const watchlist = await Watchlist.findOne({
      _id: watchlistId,
      userId: userId,
    });

    // If watchlist is not found, return a 404 error
    if (!watchlist) {
      return res.status(404).json({ message: "Watchlist not found" });
    }

    // Update the watchlist name and updatedAt field
    watchlist.name = newWatchlistName;
    watchlist.updatedAt = new Date();

    //Save the updated watchlist
    await watchlist.save();

    //Return success response
    return res.status(200).json({
      message: "Watchlist updated successfully",
      watchlist,
    });
  } catch (error) {
    // Handle any unexpected errors
    console.error(error);
    return res.status(500).json({ message: "An unexpected error occurred" });
  }
};

// Delete the watchlist
exports.deleteWatchlist = async (req, res) => {
  const userId = req.user.id;
  try {
    if (!userId) {
      return res.status(401).json({ message: "Authorization Required" });
    }
    //Validate request parameters (watchlistId)
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Watchlist ID is missing" });
    }

    //Find the watchlist that belongs to the user
    const watchlist = await Watchlist.findOne({
      _id: id,
      userId: userId,
    });
    // If watchlist is not found, return a 404 error
    if (!watchlist) {
      return res.status(404).json({ message: "Watchlist not found" });
    }

    //Delete the watchlist when found
    await Watchlist.deleteOne({ _id: watchlist._id });
    
    return res.status(200).json({ message: "Watchlist deleted successfully" }); //Return success message after deleting watchlist
  } catch (error) {
    res.status(500).json({ message: "Failed to delete watchlist", error });
  }
}

// Remove an item off the watchlist
exports.removeItemFromWatchlist = async (req, res) => {
  const userId = req.user.id; // Get the user ID from the request

  try {
    // Check if the user ID is present
    if (!userId) {
      return res.status(401).json({ message: "Authorization Required" });
    }

    const { id: watchlistId, itemId } = req.params; // Extract watchlist ID and item ID from route params

    // Check if watchlist ID and item ID are provided
    if (!watchlistId || !itemId) {
      return res.status(400).json({ message: "Watchlist ID and Item ID are required" });
    }

    // Find the watchlist that belongs to the user
    const watchlist = await Watchlist.findOne({
      _id: watchlistId,
      userId: userId,
    });

    // Check if the watchlist exists
    if (!watchlist) {
      return res.status(404).json({ message: "Watchlist not found" });
    }

    // Filter out the item to remove it from the watchlist
    watchlist.items = watchlist.items.filter(item => item.id !== itemId);
    watchlist.updatedAt = new Date(); // Update the watchlist's updatedAt field

    // Save the updated watchlist
    await watchlist.save();

    // Respond with success message and the updated watchlist
    return res.status(200).json({
      message: "Item removed from watchlist successfully",
      watchlist,
    });
  } catch (error) {
    console.error(error);
    // Handle any errors that occur during the process
    res.status(500).json({ message: "Failed to remove item from watchlist", error });
  }
};

// // Check if the item exists in the watchlist
// exports.checkItemInWatchlist = async (req, res) => {
//   try {
//     // Extract user ID (assuming authentication middleware has set req.user)
//     const userId = req.user.id;
//     if (!userId) {
//       return res.status(401).json({ message: "Authorization Required" });
//     }

//     // Extract watchlistId and itemId from request body
//     const { watchlistId, itemId } = req.body;
//     if (!watchlistId || !itemId) {
//       return res.status(400).json({ message: "Watchlist ID and Item ID are required" });
//     }

//     // Find the watchlist that belongs to the user
//     const watchlist = await Watchlist.findOne({
//       _id: watchlistId,
//       userId: userId,
//     });

//     // Check if the watchlist exists
//     if (!watchlist) {
//       return res.status(404).json({ message: "Watchlist not found" });
//     }

//     // Check if the item exists in the watchlist
//     const itemExists = watchlist.items.some(item => item.id === itemId);

//     if (itemExists) {
//       return res.status(200).json({ message: "Item exists in the watchlist", exists: true });
//     } else {
//       return res.status(200).json({ message: "Item does not exist in the watchlist", exists: false });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Failed to check item in watchlist", error });
//   }
// };

