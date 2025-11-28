"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const csurf_1 = __importDefault(require("csurf"));
const router = (0, express_1.Router)();
const csrfProtection = (0, csurf_1.default)({ cookie: true });
router.get("/csrf-token", csrfProtection, (req, res) => {
    res.json({ csrfToken: req.csrfToken() });
});
exports.default = router;
