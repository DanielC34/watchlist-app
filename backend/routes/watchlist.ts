import { Router } from "express";
import csrf from "csurf";
import {
  createWatchlist,
  getAllWatchlists,
  getWatchlistById,
  updateWatchlist,
  deleteWatchlist,
  addItemToWatchlist,
  removeItemFromWatchlist,
} from "../controllers/watchlistController";
import { protect } from "../middleware/authMiddleware";

const router = Router();
const csrfProtection = csrf({ cookie: true });

router.post("/create", protect, csrfProtection, createWatchlist);
router.get("/", protect, getAllWatchlists);
router.get("/:id", protect, getWatchlistById);
router.put("/:id", protect, csrfProtection, updateWatchlist);
router.delete("/:id", protect, csrfProtection, deleteWatchlist);
router.post("/:id/add-item", protect, csrfProtection, addItemToWatchlist);
router.delete(
  "/:id/items/:itemId",
  protect,
  csrfProtection,
  removeItemFromWatchlist
);

export default router;
