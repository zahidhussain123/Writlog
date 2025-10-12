import express from "express";
import userRoutes from "./routes/user.route.js";
import postRoutes from "./routes/post.route.js";
import commentRoutes from "./routes/comment.route.js";
import webHookRoutes from "./routes/webhook.route.js";
import dotenv from "dotenv";
import { connectDB } from "./lib/connectDB.js";
import { clerkClient, clerkMiddleware, getAuth } from "@clerk/express";

const app = express();

dotenv.config();
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
