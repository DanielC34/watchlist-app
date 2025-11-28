const mongoose = require("mongoose");

const watchlistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  items: [
    {
      movieId: {
        type: String,
        required: true,
      },
      title: {
        type: String,
        required: true,
      },
      posterPath: {
        type: String,
      },
      mediaType: {
        type: String,
        enum: ["movie", "tv"],
        required: true,
      },
      releaseDate: {
        type: String,
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

module.exports = mongoose.model("Watchlist", watchlistSchema);
