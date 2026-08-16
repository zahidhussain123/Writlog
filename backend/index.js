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
const PORT = process.env.PORT || 5000;


const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim().replace(/\/+$/, ""))
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // No Origin header: curl, health checks, and the Svix webhook POSTs.
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin.replace(/\/+$/, ""))) {
        return callback(null, true);
      }
      callback(new Error(`Blocked by CORS: ${origin}`));
    },
    credentials: true,
  })
);

// Must stay above express.json(): svix needs the raw body to verify signatures.
app.use("/webhooks", webHookRoutes);

app.use(clerkMiddleware());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (req, res) => res.status(200).json({ status: "ok" }));

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

app.use((req, res) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
});

app.use((error, req, res, next) => {
  console.error(error);
  res.status(error.status || 500).json({
    message: error.message || "Something went wrong",
    stack: process.env.NODE_ENV === "production" ? undefined : error.stack,
  });
});

const start = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("\n❌ Could not start the server. The database is unreachable.");
    console.error(`   ${error.message}\n`);
    console.error("   Check MONGODB in backend/.env and that your Atlas cluster exists");
    console.error("   and that this machine's IP is allowed in Atlas → Network Access.\n");
    process.exit(1);
  }
};

start();
