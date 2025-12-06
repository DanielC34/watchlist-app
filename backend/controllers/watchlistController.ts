import { Response } from "express";
import Watchlist from "../models/Watchlist";
import { AuthRequest, IWatchlistItem } from "../types";

export const createWatchlist = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  if (!req.user?._id) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    const { name, description }: { name?: string; description?: string } =
      req.body;

    if (!name) {
      return res.status(400).json({ message: "Watchlist name is required" });
    }

    const newWatchlist = new Watchlist({
      name,
      description,
      userId: req.user._id,
      items: [],
    });

    const savedWatchlist = await newWatchlist.save();

    return res.status(201).json(savedWatchlist);
  } catch (error) {
    console.error("Error creating watchlist:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getAllWatchlists = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  if (!req.user?._id) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    const watchlists = await Watchlist.find({ userId: req.user._id });
    return res.json(watchlists);
  } catch (error) {
    console.error("Error fetching watchlists:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getWatchlistById = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  if (!req.user?._id) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    const watchlist = await Watchlist.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!watchlist) {
      return res.status(404).json({ message: "Watchlist not found" });
    }

    return res.json(watchlist);
  } catch (error) {
    console.error("Error fetching watchlist:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const updateWatchlist = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  if (!req.user?._id) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    const { name, description }: { name?: string; description?: string } =
      req.body;

    if (!name) {
      return res.status(400).json({ message: "Watchlist name is required" });
    }

    const updatedWatchlist = await Watchlist.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      {
        name,
        description,
        updatedAt: Date.now(),
      },
      { new: true }
    );

    if (!updatedWatchlist) {
      return res.status(404).json({ message: "Watchlist not found" });
    }

    return res.json(updatedWatchlist);
  } catch (error) {
    console.error("Error updating watchlist:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const deleteWatchlist = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  if (!req.user?._id) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    const deletedWatchlist = await Watchlist.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!deletedWatchlist) {
      return res.status(404).json({ message: "Watchlist not found" });
    }

    return res.json({ message: "Watchlist deleted successfully" });
  } catch (error) {
    console.error("Error deleting watchlist:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const addItemToWatchlist = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  if (!req.user?._id) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    const {
      movieId,
      title,
      posterPath,
      mediaType,
      releaseDate,
    }: {
      movieId?: string;
      title?: string;
      posterPath?: string;
      mediaType?: "movie" | "tv";
      releaseDate?: string;
    } = req.body;

    if (!movieId || !title || !mediaType) {
      return res
        .status(400)
        .json({ message: "Movie ID, title, and media type are required" });
    }

    const watchlist = await Watchlist.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!watchlist) {
      return res.status(404).json({ message: "Watchlist not found" });
    }

    const itemExists = watchlist.items.some(
      (item) => item.movieId === movieId && item.mediaType === mediaType
    );

    if (itemExists) {
      return res
        .status(400)
        .json({ message: "Item already exists in watchlist" });
    }

    const newItem: IWatchlistItem = {
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
  } catch (error) {
    console.error("Error adding item to watchlist:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const removeItemFromWatchlist = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  if (!req.user?._id) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    const watchlist = await Watchlist.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!watchlist) {
      return res.status(404).json({ message: "Watchlist not found" });
    }

    const itemIndex = watchlist.items.findIndex(
      (item) => item._id?.toString() === req.params.itemId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in watchlist" });
    }

    watchlist.items.splice(itemIndex, 1);
    watchlist.updatedAt = new Date();

    await watchlist.save();

    return res.json({ message: "Item removed from watchlist" });
  } catch (error) {
    console.error("Error removing item from watchlist:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const updateWatchlistItem = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  if (!req.user?._id) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    const { status, rating, personalNotes } = req.body;

    const watchlist = await Watchlist.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!watchlist) {
      return res.status(404).json({ message: "Watchlist not found" });
    }

    const item = watchlist.items.find(
      (item) => item._id?.toString() === req.params.itemId
    );

    if (!item) {
      return res.status(404).json({ message: "Item not found in watchlist" });
    }

    if (status) item.status = status;
    if (rating !== undefined) item.rating = rating;
    if (personalNotes !== undefined) item.personalNotes = personalNotes;

    watchlist.updatedAt = new Date();

    await watchlist.save();

    return res.json(watchlist);
  } catch (error) {
    console.error("Error updating watchlist item:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getRecentActivity = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  if (!req.user?._id) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    const watchlists = await Watchlist.find({ userId: req.user._id }).lean();
    let allItems: any[] = [];

    watchlists.forEach((list) => {
      const itemsWithListName = list.items.map((item: any) => ({
        ...item,
        watchlistName: list.name,
        watchlistId: list._id,
      }));
      allItems = [...allItems, ...itemsWithListName];
    });

    // Sort by addedAt desc
    allItems.sort((a, b) => {
      return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
    });

    // Limit to 10
    const recentActivity = allItems.slice(0, 10);

    return res.json(recentActivity);
  } catch (error) {
    console.error("Error fetching recent activity:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
