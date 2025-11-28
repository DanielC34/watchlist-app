"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const csurf_1 = __importDefault(require("csurf"));
const authController_1 = require("../controllers/authController");
const router = (0, express_1.Router)();
const csrfProtection = (0, csurf_1.default)({ cookie: true });
router.post("/register", csrfProtection, authController_1.register);
router.post("/login", csrfProtection, authController_1.login);
router.post("/logout", csrfProtection, authController_1.logout);
exports.default = router;
