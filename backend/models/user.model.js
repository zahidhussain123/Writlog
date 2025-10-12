import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
  clerkId: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  img: {
    type: String,
  },
  savedPosts: {
    type: [String],
    default: [],
  },
},
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
