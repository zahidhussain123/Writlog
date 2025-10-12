import postModel from "../models/post.model.js";

export const getPosts = async (req, res) => {
  try {
    const posts = await postModel.find();
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching posts", error: error });
    console.log(error);
  }
};

export const getPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await postModel.findOne({ slug: postId });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: "Error fetching post", error: error });
  }
};

export const createPost = async (req, res) => {
  try {
    const payload = req.body;
    if (!payload) {
      return res.status(400).json({ message: "Post data is required" });
    }

    const postCreated = await postModel.create(payload);
    const newPost = await postCreated.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ message: "Error creating post", error: error });
  }
};

export const deletePost = async (req, res) => {
  try {
    const id = await req.params.id;
    if (!id) {
      return res.status(400).json({ message: "Post id is required" });
    }
    await postModel.findByIdAndDelete(id);
    res.status(200).json({ message: "Post is deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting post", error: error });
  }
};
