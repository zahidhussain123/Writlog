import { getAuth } from "@clerk/express";
import { getImageKit } from "../lib/imagekit.js";
import commentModel from "../models/comment.model.js";
import postModel from "../models/post.model.js";
import userModel from "../models/user.model.js";

const SORT_OPTIONS = {
  newest: { createdAt: -1 },
  oldest: { createdAt: 1 },
  popular: { visit: -1, createdAt: -1 },
  trending: { visit: -1, createdAt: -1 },
};

const TRENDING_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;

const slugify = (title) =>
  title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

export const getPosts = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 5, 1), 50);
    const { cat, author, search, featured } = req.query;
    const sort = SORT_OPTIONS[req.query.sort] ? req.query.sort : "newest";

    const query = {};

    if (cat && cat !== "all") query.category = cat;
    if (search) query.title = { $regex: search, $options: "i" };
    if (featured === "true") query.isFeatured = true;

    if (author) {
      const postAuthor = await userModel.findOne({ username: author }).select("_id");
      if (!postAuthor) {
        return res.status(200).json({ posts: [], hasMore: false, totalPosts: 0 });
      }
      query.user = postAuthor._id;
    }

    // "Trending" is the most visited posts of the last week. If nothing was
    // published in that window, fall back to all-time so the tab is never empty.
    if (sort === "trending") {
      const since = new Date(Date.now() - TRENDING_WINDOW_MS);
      const recentCount = await postModel.countDocuments({ ...query, createdAt: { $gte: since } });
      if (recentCount > 0) query.createdAt = { $gte: since };
    }

    const totalPosts = await postModel.countDocuments(query);
    const posts = await postModel
      .find(query)
      .populate("user", "username displayName img")
      .sort(SORT_OPTIONS[sort])
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({ posts, hasMore: page * limit < totalPosts, totalPosts });
  } catch (error) {
    console.error("getPosts failed:", error);
    res.status(500).json({ message: "Error fetching posts", error: error.message });
  }
};

export const getPost = async (req, res) => {
  try {
    // clerkId lets the client tell whether the reader owns this post; the
    // delete endpoint re-checks it server-side either way.
    const post = await postModel
      .findOneAndUpdate({ slug: req.params.slug }, { $inc: { visit: 1 } }, { new: true })
      .populate("user", "username displayName img clerkId");

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json(post);
  } catch (error) {
    console.error("getPost failed:", error);
    res.status(500).json({ message: "Error fetching post", error: error.message });
  }
};

export const createPost = async (req, res) => {
  try {
    const { userId: clerkId } = getAuth(req);
    if (!clerkId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await userModel.findOne({ clerkId });
    if (!user) {
      return res.status(404).json({ message: "User not found. Please sign in again." });
    }

    const { title, desc, category, content, img } = req.body || {};
    if (!title?.trim()) {
      return res.status(400).json({ message: "Title is required" });
    }
    if (!content?.trim()) {
      return res.status(400).json({ message: "Content is required" });
    }

    const baseSlug = slugify(title) || "post";
    let slug = baseSlug;
    let counter = 2;
    while (await postModel.exists({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const newPost = await postModel.create({
      user: user._id,
      slug,
      title: title.trim(),
      desc,
      category: category || "general",
      content,
      img,
    });

    res.status(201).json(newPost);
  } catch (error) {
    console.error("createPost failed:", error);
    res.status(500).json({ message: "Error creating post", error: error.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const { userId: clerkId, sessionClaims } = getAuth(req);
    if (!clerkId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Post id is required" });
    }

    if (sessionClaims?.metadata?.role === "admin") {
      const deleted = await postModel.findByIdAndDelete(id);
      if (!deleted) return res.status(404).json({ message: "Post not found" });
      // Comments reference the post, so they'd be orphaned without this.
      await commentModel.deleteMany({ post: id });
      return res.status(200).json({ message: "Post is deleted successfully" });
    }

    const user = await userModel.findOne({ clerkId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const deleted = await postModel.findOneAndDelete({ _id: id, user: user._id });
    if (!deleted) {
      return res.status(403).json({ message: "You can delete only your own posts" });
    }

    await commentModel.deleteMany({ post: id });

    res.status(200).json({ message: "Post is deleted successfully" });
  } catch (error) {
    console.error("deletePost failed:", error);
    res.status(500).json({ message: "Error deleting post", error: error.message });
  }
};

export const uploadImage = async (req, res) => {
  try {
    const result = getImageKit().getAuthenticationParameters();
    res.status(200).json({ ...result, publicKey: process.env.IMAGEKIT_PUBLIC_KEY });
  } catch (error) {
    console.error("uploadImage failed:", error);
    res.status(500).json({ message: "Error getting upload url", error: error.message });
  }
};
