const express = require("express");
const csrf = require('csurf');
const { getUser, updateUserProfilePicture } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

// CSRF protection
const csrfProtection = csrf({ cookie: true });

// Protect route to ensure only logged-in users can access
router.get("/me", protect, getUser);

// Protect route for updating profile picture
router.put("/profile/picture", protect, csrfProtection, updateUserProfilePicture);

module.exports = router;
