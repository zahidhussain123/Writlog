import dotenv from "dotenv";
dotenv.config();

import express from "express";
import userRoutes from "./routes/user.route.js";
import postRoutes from "./routes/post.route.js";
import commentRoutes from "./routes/comment.route.js";
import webHookRoutes from "./routes/webhook.route.js";
import { connectDB } from "./lib/connectDB.js";
import { clerkMiddleware, getAuth } from "@clerk/express";
import cors from "cors";
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: process.env.CLIENT_URL }));
app.use("/webhooks", webHookRoutes);
app.use(clerkMiddleware());
app.use(express.json());
app.use("/users", userRoutes);
app.use("/posts", postRoutes);
app.use("/comments", commentRoutes);

// protected routes
app.use(
  "/protected",
  (req, res, next) => {
    const { userId } = getAuth(req);
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    next();
  },
  (req, res) => {
    res.json({
      message: "This is a protected route",
      userId: getAuth(req).userId,
    });
  }
);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use((error, req, res, next) => {
  res.json({
    message: error.message || "Something went wrong",
    status: res.status,
    stack: res.stack,
  });
});

app.listen(process.env.port, () => {
  connectDB();
  console.log("Server is running on port 5000");
});
