const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: { type: String, required: true, minlength: 6 },
  profilePicture: { type: String, default: "" },
  createdAt: {
    type: Date,
    default: Date.now, // Automatically sets the creation date
  },
});


module.exports = mongoose.model("User", UserSchema);

