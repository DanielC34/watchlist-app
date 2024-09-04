const User = require("../models/User");

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.updateUserProfilePicture = async (req, res) => {
  try {
    //Extract userId from req.user and extract newProfilePicture from req.body
    const userId = req.user.id;
    const { newProfilePicture } = req.body

    //Check if newProfilePicture is provided
    if (!newProfilePicture) {
      return res.status(400).json({
        error: "Bad Request",
        message:
          'The required variable "newProfilePicture" is missing or invalid.',
      });
    }

      //Find user by userId
      const user = await User.findById(userId);

      //If user is not found, send a response with a 404 status code
    if (!user) {
      return res.status(404).json({
        error: "Not found",
        message: `User with ID ${userId} not found`,
      });
    }

        //If user is found, update profilePicture field
        user.profilePicture = newProfilePicture;

        //Save te updated user info back in the database
        await user.save();

        //Send a success response with a 200 status code and the updated user data
        res.status(200).json(user);
      
  } catch (err) {
    //Catch any errors that occur during the process
    res.status(500).json({ error: "Server error", message: err.message });
  }
};
