const express = require("express");
const {
  getWatchlist,
  addItemToWatchlist,
  deleteWatchlist,
  removeItemFromWatchlist,
  createWatchlist,
  updateWatchlist,
  checkItemInWatchlist,
} = require("../controllers/watchlistController");
const auth = require("../middleware/authMiddleware");
const router = express.Router();


router.get("/:id", auth, getWatchlist); // GET: Get all watchlists for user (if they exist)
router.post("/:id/add-item", auth, addItemToWatchlist); //POST: Create a new watchlist
router.delete("/:id", auth, deleteWatchlist); //DELETE: Delete a watchlist by ID
router.put("/update", auth, updateWatchlist); //PUT: Update an existing watchlist
router.delete(
  "/:id/remove-item/:itemId",
  auth,
  removeItemFromWatchlist
); //DELETE: Delete an item off the watchlist by ID
router.post("/create", auth, createWatchlist);
// router.get("/:id/check-item/:itemId", auth, checkItemInWatchlist); //GET: check if specific item is in watchlist

module.exports = router;
