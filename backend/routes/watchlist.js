const express = require("express");
const router = express.Router();
const {
  createWatchlist,
  getAllWatchlists,
  getWatchlistById,
  updateWatchlist,
  deleteWatchlist,
  addItemToWatchlist,
  removeItemFromWatchlist,
} = require("../controllers/watchlistController");
const { protect } = require('../middleware/authMiddleware');

// Create a new watchlist
router.post("/create", protect, createWatchlist);

// Get all watchlists for the current user
router.get("/", protect, getAllWatchlists);

// Get a single watchlist by ID
router.get("/:id", protect, getWatchlistById);

// Update a watchlist
router.put("/:id", protect, updateWatchlist);

// Delete a watchlist
router.delete("/:id", protect, deleteWatchlist);

// Add an item to a watchlist
router.post("/:id/add-item", protect, addItemToWatchlist);

// Remove an item from a watchlist
router.delete("/:id/items/:itemId", protect, removeItemFromWatchlist);

module.exports = router;
