const express = require("express");
const csrf = require('csurf');
const router = express.Router();

// CSRF protection
const csrfProtection = csrf({ cookie: true });

// Get CSRF token endpoint
router.get("/csrf-token", csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

module.exports = router;