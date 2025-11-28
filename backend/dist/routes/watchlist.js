"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const csurf_1 = __importDefault(require("csurf"));
const watchlistController_1 = require("../controllers/watchlistController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
const csrfProtection = (0, csurf_1.default)({ cookie: true });
router.post("/create", authMiddleware_1.protect, csrfProtection, watchlistController_1.createWatchlist);
router.get("/", authMiddleware_1.protect, watchlistController_1.getAllWatchlists);
router.get("/:id", authMiddleware_1.protect, watchlistController_1.getWatchlistById);
router.put("/:id", authMiddleware_1.protect, csrfProtection, watchlistController_1.updateWatchlist);
router.delete("/:id", authMiddleware_1.protect, csrfProtection, watchlistController_1.deleteWatchlist);
router.post("/:id/add-item", authMiddleware_1.protect, csrfProtection, watchlistController_1.addItemToWatchlist);
router.delete("/:id/items/:itemId", authMiddleware_1.protect, csrfProtection, watchlistController_1.removeItemFromWatchlist);
exports.default = router;
