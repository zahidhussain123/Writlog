import { imagekit } from "../lib/imageKit.js";
import postModel from "../models/post.model.js";
import userModel from "../models/user.model.js";

export const getPosts = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5
  console.log({ page, limit });
  try {
    const posts = await postModel.find().populate("user", "username").skip((page - 1) * limit);
    const totalPosts = await postModel.countDocuments();
    const hasMore = page * limit < totalPosts;
    console.log({page, limit, totalPosts, hasMore})
    res.status(200).json({posts, hasMore});
  } catch (error) {
    res.status(500).json({ message: "Error fetching posts", error: error });
    console.log(error);
  }
};

export const getPost = async (req, res) => {
  try {
    const postId = req.params.slug;
    const post = await postModel.findOne({ slug: postId }).populate("user", "username img");
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: "Error fetching post", error: error });
  }
};

export const createPost = async (req, res) => {
  const clerkId = req.auth.userId;
  if (!clerkId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const user = await userModel.findOne({ clerkId });

  try {
    const payload = req.body;
    if (!payload) {
      return res.status(400).json({ message: "Post data is required" });
    }

    let slug = req.body.title.replace(/ /g, "-").toLowerCase();

    let existingPost = await postModel.findOne({ slug });

    let counter = 2;

    while (existingPost) {
      slug = `${slug}-${counter}`;
      existingPost = await postModel.findOne({ slug });
      counter++;
    }

    const postCreated = await postModel.create({
      user: user._id,
      slug,
      ...payload,
    });
    const newPost = await postCreated.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ message: "Error creating post", error: error });
  }
};

export const deletePost = async (req, res) => {
  const userId = req.auth.userId;
  try {
    const id = await req.params.id;
    if (!id) {
      return res.status(400).json({ message: "Post id is required" });
    }
    await postModel.findByIdAndDelete({ id, user: user._id });
    res.status(200).json({ message: "Post is deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting post", error: error });
  }
};

console.log("ImageKit ENV values:", {
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY ? "✔️ exists" : "❌ missing",
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

export const uploadImage = async (req, res) => {
  try {
    const result = imagekit.getAuthenticationParameters();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Error getting upload url", error: error });
  } 
};
