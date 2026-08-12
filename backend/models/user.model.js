import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
  clerkId: {
    type: String,
    required: true,
    unique: true,
  },
  // Unique handle used in URLs (?author=). Derived, never free text.
  username: {
    type: String,
    required: true,
    unique: true,
  },
  // Human-readable name for display. Not unique, since two people may share one.
  displayName: {
    type: String,
    default: "",
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
