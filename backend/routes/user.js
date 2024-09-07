const express = require("express");
const { getUser, updateUserProfilePicture } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

// Protect route to ensure only logged-in users can access
router.get("/me", protect, getUser);

// Protect route for updating profile picture
router.put("/profile/picture", protect, updateUserProfilePicture);

module.exports = router;
