const express = require("express");
const csrf = require('csurf');
const { register, login, logout } = require("../controllers/authController");
const router = express.Router();

// CSRF protection
const csrfProtection = csrf({ cookie: true });

router.post("/register", csrfProtection, register);
router.post("/login", csrfProtection, login);
router.post("/logout", csrfProtection, logout);

module.exports = router;
