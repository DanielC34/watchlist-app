//main entry point of application

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const MongoStore = require("connect-mongo");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// // Middleware
app.use(cors());
app.use(express.json());

// Session middleware setup
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  cookie: { secure: false, httpOnly: true } // Adjust 'secure' based on your environment (true for HTTPS)
}));

// Database Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() =>
    console.log("MongoDB connected", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
  )
  .catch((err) => console.log(err));

// // Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/user", require("./routes/user"));
app.use("/api/watchlist", require("./routes/watchlist"));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
