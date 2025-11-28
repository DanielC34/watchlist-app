"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const csurf_1 = __importDefault(require("csurf"));
const userController_1 = require("../controllers/userController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
const csrfProtection = (0, csurf_1.default)({ cookie: true });
router.get("/me", authMiddleware_1.protect, userController_1.getUser);
router.put("/profile/picture", authMiddleware_1.protect, csrfProtection, userController_1.updateUserProfilePicture);
exports.default = router;
