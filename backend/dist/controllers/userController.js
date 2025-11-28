"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserProfilePicture = exports.getUser = void 0;
const User_1 = __importDefault(require("../models/User"));
const getUser = async (req, res) => {
    if (!req.user?._id) {
        return res.status(401).json({ error: "Not authenticated" });
    }
    try {
        const user = await User_1.default.findById(req.user._id).select("-password");
        return res.json(user);
    }
    catch (err) {
        return res.status(500).json({ error: "Server error" });
    }
};
exports.getUser = getUser;
const updateUserProfilePicture = async (req, res) => {
    if (!req.user?._id) {
        return res.status(401).json({ error: "Not authenticated" });
    }
    try {
        const { newProfilePicture } = req.body;
        if (!newProfilePicture) {
            return res.status(400).json({
                error: "Bad Request",
                message: 'The required variable "newProfilePicture" is missing or invalid.',
            });
        }
        const user = await User_1.default.findById(req.user._id);
        if (!user) {
            return res.status(404).json({
                error: "Not found",
                message: `User with ID ${req.user._id} not found`,
            });
        }
        user.profilePicture = newProfilePicture;
        await user.save();
        return res.status(200).json(user);
    }
    catch (err) {
        return res
            .status(500)
            .json({ error: "Server error", message: err.message });
    }
};
exports.updateUserProfilePicture = updateUserProfilePicture;
