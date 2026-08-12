import express from 'express';
import { createComment, getPostComments, deleteComment } from '../controller/comment.controller.js';

const router = express.Router();

router.get("/:postId", getPostComments)
router.post("/:postId", createComment)
router.delete("/:id", deleteComment)

export default router;