"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeItemFromWatchlist = exports.addItemToWatchlist = exports.deleteWatchlist = exports.updateWatchlist = exports.getWatchlistById = exports.getAllWatchlists = exports.createWatchlist = void 0;
const Watchlist_1 = __importDefault(require("../models/Watchlist"));
const createWatchlist = async (req, res) => {
    if (!req.user?._id) {
        return res.status(401).json({ message: "Not authenticated" });
    }
    try {
        const { name, description } = req.body;
        if (!name) {
            return res.status(400).json({ message: "Watchlist name is required" });
        }
        const newWatchlist = new Watchlist_1.default({
            name,
            description,
            userId: req.user._id,
            items: [],
        });
        const savedWatchlist = await newWatchlist.save();
        return res.status(201).json(savedWatchlist);
    }
    catch (error) {
        console.error("Error creating watchlist:", error);
        return res.status(500).json({ message: "Server error" });
    }
};
exports.createWatchlist = createWatchlist;
const getAllWatchlists = async (req, res) => {
    if (!req.user?._id) {
        return res.status(401).json({ message: "Not authenticated" });
    }
    try {
        const watchlists = await Watchlist_1.default.find({ userId: req.user._id });
        return res.json(watchlists);
    }
    catch (error) {
        console.error("Error fetching watchlists:", error);
        return res.status(500).json({ message: "Server error" });
    }
};
exports.getAllWatchlists = getAllWatchlists;
const getWatchlistById = async (req, res) => {
    if (!req.user?._id) {
        return res.status(401).json({ message: "Not authenticated" });
    }
    try {
        const watchlist = await Watchlist_1.default.findOne({
            _id: req.params.id,
            userId: req.user._id,
        });
        if (!watchlist) {
            return res.status(404).json({ message: "Watchlist not found" });
        }
        return res.json(watchlist);
    }
    catch (error) {
        console.error("Error fetching watchlist:", error);
        return res.status(500).json({ message: "Server error" });
    }
};
exports.getWatchlistById = getWatchlistById;
const updateWatchlist = async (req, res) => {
    if (!req.user?._id) {
        return res.status(401).json({ message: "Not authenticated" });
    }
    try {
        const { name, description } = req.body;
        if (!name) {
            return res.status(400).json({ message: "Watchlist name is required" });
        }
        const updatedWatchlist = await Watchlist_1.default.findOneAndUpdate({ _id: req.params.id, userId: req.user._id }, {
            name,
            description,
            updatedAt: Date.now(),
        }, { new: true });
        if (!updatedWatchlist) {
            return res.status(404).json({ message: "Watchlist not found" });
        }
        return res.json(updatedWatchlist);
    }
    catch (error) {
        console.error("Error updating watchlist:", error);
        return res.status(500).json({ message: "Server error" });
    }
};
exports.updateWatchlist = updateWatchlist;
const deleteWatchlist = async (req, res) => {
    if (!req.user?._id) {
        return res.status(401).json({ message: "Not authenticated" });
    }
    try {
        const deletedWatchlist = await Watchlist_1.default.findOneAndDelete({
            _id: req.params.id,
            userId: req.user._id,
        });
        if (!deletedWatchlist) {
            return res.status(404).json({ message: "Watchlist not found" });
        }
        return res.json({ message: "Watchlist deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting watchlist:", error);
        return res.status(500).json({ message: "Server error" });
    }
};
exports.deleteWatchlist = deleteWatchlist;
const addItemToWatchlist = async (req, res) => {
    if (!req.user?._id) {
        return res.status(401).json({ message: "Not authenticated" });
    }
    try {
        const { movieId, title, posterPath, mediaType, releaseDate, } = req.body;
        if (!movieId || !title || !mediaType) {
            return res
                .status(400)
                .json({ message: "Movie ID, title, and media type are required" });
        }
        const watchlist = await Watchlist_1.default.findOne({
            _id: req.params.id,
            userId: req.user._id,
        });
        if (!watchlist) {
            return res.status(404).json({ message: "Watchlist not found" });
        }
        const itemExists = watchlist.items.some((item) => item.movieId === movieId && item.mediaType === mediaType);
        if (itemExists) {
            return res
                .status(400)
                .json({ message: "Item already exists in watchlist" });
        }
        const newItem = {
            movieId,
            title,
            posterPath,
            mediaType,
            releaseDate,
            addedAt: new Date(),
        };
        watchlist.items.push(newItem);
        watchlist.updatedAt = new Date();
        await watchlist.save();
        return res.status(201).json(watchlist);
    }
    catch (error) {
        console.error("Error adding item to watchlist:", error);
        return res.status(500).json({ message: "Server error" });
    }
};
exports.addItemToWatchlist = addItemToWatchlist;
const removeItemFromWatchlist = async (req, res) => {
    if (!req.user?._id) {
        return res.status(401).json({ message: "Not authenticated" });
    }
    try {
        const watchlist = await Watchlist_1.default.findOne({
            _id: req.params.id,
            userId: req.user._id,
        });
        if (!watchlist) {
            return res.status(404).json({ message: "Watchlist not found" });
        }
        const itemIndex = watchlist.items.findIndex((item) => item._id?.toString() === req.params.itemId);
        if (itemIndex === -1) {
            return res.status(404).json({ message: "Item not found in watchlist" });
        }
        watchlist.items.splice(itemIndex, 1);
        watchlist.updatedAt = new Date();
        await watchlist.save();
        return res.json({ message: "Item removed from watchlist" });
    }
    catch (error) {
        console.error("Error removing item from watchlist:", error);
        return res.status(500).json({ message: "Server error" });
    }
};
exports.removeItemFromWatchlist = removeItemFromWatchlist;
