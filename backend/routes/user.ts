import { Router } from "express";
import csrf from "csurf";
import {
  getUser,
  updateUserProfilePicture,
  getUserProfile,
  followUser,
  unfollowUser,
  searchUsers,
  getSocialFeed,
} from "../controllers/userController";
import { protect } from "../middleware/authMiddleware";

const router = Router();

const csrfProtection = csrf({ cookie: true });

router.get("/me", protect, getUser);
router.get("/profile/:userId", protect, getUserProfile);

router.put("/profile/picture", protect, csrfProtection, updateUserProfilePicture);
router.put("/follow/:userId", protect, followUser);
router.put("/unfollow/:userId", protect, unfollowUser);
router.get("/search", protect, searchUsers);
router.get("/feed", protect, getSocialFeed);

export default router;
