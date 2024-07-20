const express = require("express");
const {
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist,
} = require("../controllers/watchlistController");
const auth = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/", auth, getWatchlist);
router.post("/", auth, addToWatchlist);
router.delete("/", auth, removeFromWatchlist);

module.exports = router;
