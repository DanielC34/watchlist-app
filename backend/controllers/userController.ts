import { Response } from "express";
import User from "../models/User";
import { AuthRequest } from "../types";

export const getUser = async (req: AuthRequest, res: Response) => {
  if (!req.user?.id) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export const updateUserProfilePicture = async (
  req: AuthRequest,
  res: Response
) => {
  if (!req.user?.id) {
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

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        error: "Not found",
        message: `User with ID ${req.user.id} not found`,
      });
    }

    user.profilePicture = newProfilePicture;

    await user.save();

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: "Server error", message: (err as Error).message });
  }
};
