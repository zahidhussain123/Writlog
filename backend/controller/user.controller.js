import { getAuth } from "@clerk/express";
import postModel from "../models/post.model.js";
import { ensureUser } from "../lib/users.js";

/**
 * The signed-in reader's own row.
 *
 * The client can't derive this: `username` is the handle `?author=` filters on,
 * and it's built server-side by `buildUsername` — slugified, and de-duplicated
 * with a numeric suffix when two people share a name. So Clerk's copy of the
 * profile is not enough to link someone to their own posts.
 */
export const getMe = async (req, res) => {
  try {
    const { userId: clerkId } = getAuth(req);
    if (!clerkId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await ensureUser(clerkId);
    if (!user) {
      return res.status(404).json({ message: "User not found. Please sign in again." });
    }

    res.status(200).json({
      _id: user._id,
      username: user.username,
      displayName: user.displayName,
      img: user.img,
      postCount: await postModel.countDocuments({ user: user._id }),
    });
  } catch (error) {
    console.error("getMe failed:", error);
    res.status(500).json({ message: "Error fetching user", error: error.message });
  }
};
