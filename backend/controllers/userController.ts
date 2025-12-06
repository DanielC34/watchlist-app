/// <reference path="../types/express.d.ts" />
import { Response } from "express";
import User from "../models/User";
import { AuthRequest } from "../types";

export const getUser = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  if (!req.user?._id) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  try {
    const user = await User.findById(req.user._id).select("-password");
    return res.json(user);
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
};

export const updateUserProfilePicture = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  if (!req.user?._id) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  try {
    const { newProfilePicture }: { newProfilePicture?: string } = req.body;

    if (!newProfilePicture) {
      return res.status(400).json({
        error: "Bad Request",
        message:
          'The required variable "newProfilePicture" is missing or invalid.',
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        error: "Not found",
        message: `User with ID ${req.user._id} not found`,
      });
    }

    user.profilePicture = newProfilePicture;

    await user.save();

    return res.status(200).json(user);
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Server error", message: (err as Error).message });
  }
};

export const getUserProfile = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    const user = await User.findById(req.params.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Calculate stats
    const watchlists = await import("../models/Watchlist").then(
      (m) => m.default.find({ userId: user._id }).lean()
    );

    let totalWatched = 0;
    let totalMovies = 0;
    let totalRatings = 0;
    let sumRatings = 0;

    watchlists.forEach((list) => {
      list.items.forEach((item: any) => {
        totalMovies++;
        if (item.status === "watched") {
          totalWatched++;
        }
        if (item.rating) {
          totalRatings++;
          sumRatings += item.rating;
        }
      });
    });

    const averageRating = totalRatings > 0 ? (sumRatings / totalRatings).toFixed(1) : 0;

    // Calculate mutual followers if the requesting user is authenticated
    let mutualFollowers: any[] = [];
    if (req.user?._id && req.user._id.toString() !== user._id.toString()) {
      const currentUser = await User.findById(req.user._id).lean();
      if (currentUser) {
        const userFollowers = user.followers || [];
        const currentUserFollowers = currentUser.followers || [];
        const mutualIds = userFollowers.filter((id: any) =>
          currentUserFollowers.some((currId: any) => currId.toString() === id.toString())
        );
        mutualFollowers = await User.find({ _id: { $in: mutualIds } })
          .select("-password")
          .lean();
      }
    }

    return res.json({
      user,
      stats: {
        totalWatched,
        totalMovies,
        totalRatings,
        averageRating,
      },
      mutualFollowers,
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const followUser = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  if (!req.user?._id) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    const userToFollow = await User.findById(req.params.userId);
    const currentUser = await User.findById(req.user._id);

    if (!userToFollow || !currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (userToFollow._id.toString() === currentUser._id.toString()) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }

    if (!currentUser.following.includes(userToFollow._id as any)) {
      await currentUser.updateOne({ $push: { following: userToFollow._id } });
      await userToFollow.updateOne({ $push: { followers: currentUser._id } });
      return res.json({ message: "User followed" });
    } else {
      return res.status(400).json({ message: "You already follow this user" });
    }
  } catch (error) {
    console.error("Error following user:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getSocialFeed = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  if (!req.user?._id) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    const currentUser = await User.findById(req.user._id).lean();
    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const followingIds = currentUser.following || [];

    if (followingIds.length === 0) {
      return res.json([]);
    }

    // Get watchlists from followed users
    const Watchlist = (await import("../models/Watchlist")).default;
    const watchlists = await Watchlist.find({ userId: { $in: followingIds } })
      .sort({ updatedAt: -1 })
      .limit(50)
      .lean();

    let activities: any[] = [];

    for (const list of watchlists) {
      const user = await User.findById(list.userId).select("-password").lean();

      // Get recently added items (last 30 days)
      const recentDate = new Date();
      recentDate.setDate(recentDate.getDate() - 30);

      list.items.forEach((item: any) => {
        if (new Date(item.addedAt) > recentDate) {
          activities.push({
            type: "added",
            user,
            movie: item,
            watchlistName: list.name,
            timestamp: new Date(item.addedAt),
          });
        }

        // Also include status changes (watched items)
        if (item.status === "watched" && item.rating) {
          activities.push({
            type: "rated",
            user,
            movie: item,
            watchlistName: list.name,
            timestamp: new Date(item.addedAt),
          });
        }
      });
    }

    // Sort by timestamp
    activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    // Limit to 20 most recent
    return res.json(activities.slice(0, 20));
  } catch (error) {
    console.error("Error fetching social feed:", error);
    return res.status(500).json({ message: "Server error" });
  }
};


export const unfollowUser = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  if (!req.user?._id) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    const userToUnfollow = await User.findById(req.params.userId);
    const currentUser = await User.findById(req.user._id);

    if (!userToUnfollow || !currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (currentUser.following.includes(userToUnfollow._id as any)) {
      await currentUser.updateOne({ $pull: { following: userToUnfollow._id } });
      await userToUnfollow.updateOne({ $pull: { followers: currentUser._id } });
      return res.json({ message: "User unfollowed" });
    } else {
      return res.status(400).json({ message: "You do not follow this user" });
    }
  } catch (error) {
    console.error("Error unfollowing user:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
