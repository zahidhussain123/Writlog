import express from "express";
import { getMe } from "../controller/user.controller.js";

const router = express.Router();

router.get("/me", getMe);

export default router;
