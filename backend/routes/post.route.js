import express from "express";
import {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  toggleLike,
  uploadImage,
} from "../controller/post.controller.js";

const router = express.Router();
router.get("/upload-auth", uploadImage);

router.get("/", getPosts);
router.get("/:slug", getPost);
router.post("/post", createPost);
router.patch("/post/:id", updatePost);
router.post("/post/:id/like", toggleLike);
router.delete("/post/:id", deletePost);

export default router;
