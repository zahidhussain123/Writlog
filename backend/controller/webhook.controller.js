import { Webhook } from "svix";
import userModel from "../models/user.model.js";
import { createUserFromProfile, normalizeClerkUser } from "../lib/users.js";

export const clerkWebHook = async (req, res) => {
  const secret = process.env.CLERK_WEBHOOK;
  if (!secret) {
    console.error("❌ Missing CLERK_WEBHOOK secret!");
    return res.status(500).json({ error: "Clerk Webhook secret not defined" });
  }

  const wh = new Webhook(secret);

  let evt;
  try {
    evt = wh.verify(req.body, req.headers);
  } catch (err) {
    console.error("❌ Signature verification failed:", err.message);
    return res.status(400).json({ message: "Webhook Error", error: err.message });
  }

  console.log("✅ Event received:", evt.type);

  try {
    if (evt.type === "user.created") {
      const profile = normalizeClerkUser(evt.data);

      // Clerk retries deliveries, and `ensureUser` may already have created the
      // row on the user's first request. Either way, don't create it twice.
      if (await userModel.exists({ clerkId: profile.id })) {
        console.log("↩️ User already exists, skipping:", profile.id);
        return res.status(200).json({ message: "already processed" });
      }

      await createUserFromProfile(profile);
      console.log("✅ User saved to MongoDB:", profile.id);
    } else if (evt.type === "user.updated") {
      const profile = normalizeClerkUser(evt.data);

      // Only the display fields follow Clerk. `username` stays frozen so
      // existing ?author= links keep resolving.
      await userModel.updateOne(
        { clerkId: profile.id },
        {
          displayName: `${profile.firstName || ""} ${profile.lastName || ""}`.trim(),
          img: profile.img,
        }
      );

      console.log("♻️ User updated:", profile.id);
    }
  } catch (error) {
    // 500 so Clerk retries. Swallowing this would lose the user silently.
    console.error(`❌ Failed handling ${evt.type}:`, error.message);
    return res.status(500).json({ message: "Error handling webhook" });
  }

  res.status(200).json({ message: "webhook received" });
};
