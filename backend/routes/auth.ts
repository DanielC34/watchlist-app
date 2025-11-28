import { Router } from "express";
import csrf from "csurf";
import { register, login, logout } from "../controllers/authController";

const router = Router();

const csrfProtection = csrf({ cookie: true });

router.post("/register", csrfProtection, register);
router.post("/login", csrfProtection, login);
router.post("/logout", csrfProtection, logout);

export default router;
