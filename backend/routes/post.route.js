import express from "express";
import { getPosts, getPost, createPost, deletePost } from "../controller/post.controller.js";

const router = express.Router();

router.get("/", getPosts);
router.get("/:slug", getPost)
router.post("/post", createPost)
router.delete("/post/:id", deletePost)

export default router;
