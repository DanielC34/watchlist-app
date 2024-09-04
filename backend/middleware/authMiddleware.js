const jwt = require("jsonwebtoken");
const User = require("../models/User");

const auth = async (req, res, next) => {
  const token = req.header("Authorization").replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ error: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch (err) {
    res.status(401).json({ error: "Token is not valid" });
  }
};

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Check if the authorization header is present and starts with "Bearer"
    if (authHeader && authHeader.startsWith("Bearer")) {
      
      // Extract token by splitting the header value
      const token = authHeader.split(" ")[1];

      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find the user by ID from the decoded token
      req.user = await User.findById(decoded.id).select("-password"); // Exclude password

      // Proceed to the next middleware or route handler
      next();
    } else {
      // If no token is found, send an unauthorized response
      return res.status(401).json({ error: "Not authorized, no token" });
    }
  } catch (err) {
    // If token verification or any other error occurs, send an unauthorized response
    return res.status(401).json({ error: "Token is not valid" });
  }
};

module.exports = auth;
module.exports.protect = protect;
