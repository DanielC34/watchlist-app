const bcrypt = require("bcrypt");
const User = require("../models/User");

// Hash the password before saving the user
const hashPassword = async (password) => {
  const saltRounds = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, saltRounds);
};

// Compare the given password with the hashed password stored in the database
const comparePassword = async (candidatePassword, storedPassword) => {
  return await bcrypt.compare(candidatePassword, storedPassword);
};

// Create a new user with hashed password
const createUser = async ({ username, email, password }) => {
  const hashedPassword = await hashPassword(password);
  const user = new User({ username, email, password: hashedPassword });
  await user.save();
  return user;
};

// Find a user by email
const findUserByEmail = async (email) => {
  return await User.findOne({ email });
};

module.exports = {
  hashPassword,
  comparePassword,
  createUser,
  findUserByEmail,
};
