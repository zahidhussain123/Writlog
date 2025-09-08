import express from "express";
import userRoutes from "./routes/user.route.js";
import postRoutes from "./routes/post.route.js";
import commentRoutes from "./routes/comment.route.js";
import dotenv from "dotenv";
import { connectDB } from "./lib/connectDB.js";

const app = express();

dotenv.config();
app.use("/api", userRoutes);
app.use("/api", postRoutes);
app.use("/api", commentRoutes);

app.listen(process.env.port, () => {
  connectDB();
  console.log("Server is running on port 5000");
});
