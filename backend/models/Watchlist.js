const mongoose = require("mongoose");

const WatchlistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  items: [
    {
      type: {
        // Change from String to Object
        type: String, // Keep type here to denote it's a movie or show
        required: true,
      },
      name: {
        // Change from String to Object
        type: String,
        required: true,
      },
      poster: {
        // Keep poster
        type: String,
        required: true, // Add required if necessary
      },
      addedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Watchlist", WatchlistSchema);
