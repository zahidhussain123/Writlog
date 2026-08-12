import userModel from "../models/user.model.js";
import { Webhook } from "svix";

/** URL-safe handle: "Zahid Hussain" -> "zahid-hussain". */
export const slugifyHandle = (value) =>
  String(value || "")
    .normalize("NFD")
    // Strip diacritics so "María" becomes "maria", not "mar-a".
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

/**
 * Builds a unique `username` for a new Clerk user.
 *
 * `username` is both required and unique, so anything derived from a display
 * name collides the moment two people share one, and is empty when Clerk has
 * no name on file at all. Fall through progressively better sources, then
 * de-duplicate with a numeric suffix the same way post slugs do.
 */
export const buildUsername = async (data) => {
  const sources = [
    data.username,
    `${data.first_name || ""} ${data.last_name || ""}`,
    data.email_addresses?.[0]?.email_address?.split("@")[0],
  ];

  let base = "";
  for (const source of sources) {
    base = slugifyHandle(source);
    if (base) break;
  }
  if (!base) base = `user-${String(data.id).slice(-8).toLowerCase()}`;

  let username = base;
  let counter = 2;
  while (await userModel.exists({ username })) {
    username = `${base}-${counter}`;
    counter += 1;
  }
  return username;
};

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
      const data = evt.data;

      // Clerk retries deliveries, so the same user.created can arrive twice.
      // Creating again would throw on the unique clerkId index.
      const existing = await userModel.exists({ clerkId: data.id });
      if (existing) {
        console.log("↩️ User already exists, skipping:", data.id);
        return res.status(200).json({ message: "already processed" });
      }

      await userModel.create({
        clerkId: data.id,
        email: data.email_addresses?.[0]?.email_address || "",
        username: await buildUsername(data),
        displayName: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
        img: data.image_url,
      });

      console.log("✅ User saved to MongoDB:", data.id);
    } else if (evt.type === "user.updated") {
      const data = evt.data;

      // Only the display fields follow Clerk. `username` stays frozen so
      // existing ?author= links keep resolving.
      await userModel.updateOne(
        { clerkId: data.id },
        {
          displayName: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
          img: data.image_url,
        }
      );

      console.log("♻️ User updated:", data.id);
    }
  } catch (error) {
    // 500 so Clerk retries. Swallowing this would lose the user silently.
    console.error(`❌ Failed handling ${evt.type}:`, error.message);
    return res.status(500).json({ message: "Error handling webhook" });
  }

  res.status(200).json({ message: "webhook received" });
};
