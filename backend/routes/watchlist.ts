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
const csrf = require('csurf');

// CSRF protection
const csrfProtection = csrf({ cookie: true });

// Create a new watchlist
router.post("/create", protect, csrfProtection, createWatchlist);

// Get all watchlists for the current user
router.get("/", protect, getAllWatchlists);

// Get a single watchlist by ID
router.get("/:id", protect, getWatchlistById);

// Update a watchlist
router.put("/:id", protect, csrfProtection, updateWatchlist);

// Delete a watchlist
router.delete("/:id", protect, csrfProtection, deleteWatchlist);

// Add an item to a watchlist
router.post("/:id/add-item", protect, csrfProtection, addItemToWatchlist);

// Remove an item from a watchlist
router.delete("/:id/items/:itemId", protect, csrfProtection, removeItemFromWatchlist);

module.exports = router;
