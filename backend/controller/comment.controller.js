import { getAuth } from "@clerk/express";
import commentModel from "../models/comment.model.js";
import { ensureUser } from "../lib/users.js";

export const getPostComments = async (req, res) => {
  try {
    const comments = await commentModel
      .find({ post: req.params.postId })
      .populate("user", "username displayName img clerkId")
      .sort({ createdAt: -1 });

    res.status(200).json(comments);
  } catch (error) {
    console.error("getPostComments failed:", error);
    res.status(500).json({ message: "Error fetching comments", error: error.message });
  }
};

export const createComment = async (req, res) => {
  try {
    const { userId: clerkId } = getAuth(req);
    if (!clerkId) {
      return res.status(401).json({ message: "Not authenticated!" });
    }

    const user = await ensureUser(clerkId);
    if (!user) {
      return res.status(404).json({ message: "User not found. Please sign in again." });
    }

    const desc = req.body?.desc?.trim();
    if (!desc) {
      return res.status(400).json({ message: "Comment cannot be empty" });
    }

    const savedComment = await commentModel.create({
      desc,
      user: user._id,
      post: req.params.postId,
    });

    // Return the populated document so the UI can render the author immediately.
    await savedComment.populate("user", "username displayName img clerkId");

    res.status(201).json(savedComment);
  } catch (error) {
    console.error("createComment failed:", error);
    res.status(500).json({ message: "Error creating comment", error: error.message });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { userId: clerkId, sessionClaims } = getAuth(req);
    if (!clerkId) {
      return res.status(401).json({ message: "Not authenticated!" });
    }

    const { id } = req.params;

    if (sessionClaims?.metadata?.role === "admin") {
      const deleted = await commentModel.findByIdAndDelete(id);
      if (!deleted) return res.status(404).json({ message: "Comment not found" });
      return res.status(200).json({ message: "Comment is deleted successfully" });
    }

    const user = await ensureUser(clerkId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const deletedComment = await commentModel.findOneAndDelete({ _id: id, user: user._id });
    if (!deletedComment) {
      return res.status(403).json({ message: "You can delete only your comment!" });
    }

    res.status(200).json({ message: "Comment is deleted successfully" });
  } catch (error) {
    console.error("deleteComment failed:", error);
    res.status(500).json({ message: "Error deleting comment", error: error.message });
  }
};
