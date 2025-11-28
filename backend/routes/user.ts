import { Router } from "express";
import csrf from "csurf";
import {
  getUser,
  updateUserProfilePicture,
} from "../controllers/userController";
import { protect } from "../middleware/authMiddleware";

const router = Router();

const csrfProtection = csrf({ cookie: true });

router.get("/me", protect, getUser);

router.put("/profile/picture", protect, csrfProtection, updateUserProfilePicture);

export default router;
