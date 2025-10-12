import userModel from "../models/user.model.js";
import { Webhook } from "svix";

export const clerkWebHook = async (req, res) => {
  console.log("✅ Webhook route hit!"); // should show for every request

  const secret = process.env.CLERK_WEBHOOK;
  if (!secret) {
    console.error("❌ Missing CLERK_WEBHOOK secret!");
    return res.status(500).json({ error: "Clerk Webhook secret not defined" });
  }

  const payload = req.body;
  const headers = req.headers;

  const wh = new Webhook(secret);

  let evt;
  try {
    evt = wh.verify(payload, headers);
  } catch (err) {
    console.error("❌ Signature verification failed:", err.message);
    return res.status(400).json({ message: "Webhook Error", error: err.message });
  }

  console.log("✅ Event received:", evt.type);

if (evt.type === "user.created") {
  const user = evt.data;

  await userModel.create({
    clerkId: user.id,
    email: user.email_addresses[0]?.email_address || "",
    username: `${user.first_name || ""} ${user.last_name || ""}`.trim(),
    img: user.image_url,
  });

  console.log("✅ User saved to MongoDB:", user.id);
}
 else if (evt.type === "user.updated") {
    console.log("♻️ User updated:", evt.data);
  }

  res.status(200).json({ message: "webhook received" });
};
