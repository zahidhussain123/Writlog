import express from "express";
import userRoutes from "./routes/user.route.js";
import postRoutes from "./routes/post.route.js";
import commentRoutes from "./routes/comment.route.js";

const app = express();

app.use("/api", userRoutes);
app.use("/api", postRoutes);
app.use("/api", commentRoutes);

app.listen(5000, console.log("Server is running on port 5000"));
