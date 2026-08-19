
import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import postModel from "../models/post.model.js";
import { normalizePostHtml } from "../lib/postContent.js";

const apply = process.argv.includes("--apply");

const run = async () => {
  await mongoose.connect(process.env.MONGODB);

  const posts = await postModel.find().select("slug content");
  let changed = 0;

  for (const post of posts) {
    const cleaned = normalizePostHtml(post.content || "");
    if (cleaned === post.content) continue;

    changed += 1;
    const nbsp = (post.content.match(/&nbsp;|\u00a0/g) || []).length;
    console.log(
      `${apply ? "fixed  " : "would fix"} ${post.slug}  (${nbsp} no-break spaces, ${post.content.length} -> ${cleaned.length} chars)`
    );

    if (apply) {
      await postModel.updateOne({ _id: post._id }, { content: cleaned });
    }
  }

  console.log(
    changed === 0
      ? `\nAll ${posts.length} posts are already clean.`
      : `\n${changed} of ${posts.length} posts ${apply ? "updated" : "need updating — re-run with --apply"}.`
  );

  await mongoose.disconnect();
};

run().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
