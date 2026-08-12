import { clerkClient } from "@clerk/express";
import userModel from "../models/user.model.js";

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
 * Clerk hands us user data in two shapes: snake_case in webhook payloads,
 * camelCase from the backend API. Both funnel through here.
 */
export const normalizeClerkUser = (data = {}) => ({
  id: data.id,
  username: data.username,
  firstName: data.first_name ?? data.firstName ?? "",
  lastName: data.last_name ?? data.lastName ?? "",
  email:
    data.email_addresses?.[0]?.email_address ??
    data.emailAddresses?.[0]?.emailAddress ??
    "",
  img: data.image_url ?? data.imageUrl ?? "",
});

/**
 * Builds a unique `username` for a new user.
 *
 * `username` is both required and unique, so anything derived from a display
 * name collides the moment two people share one, and is empty when Clerk has
 * no name on file at all. Fall through progressively better sources, then
 * de-duplicate with a numeric suffix the same way post slugs do.
 */
export const buildUsername = async (profile) => {
  const sources = [
    profile.username,
    `${profile.firstName || ""} ${profile.lastName || ""}`,
    profile.email?.split("@")[0],
  ];

  let base = "";
  for (const source of sources) {
    base = slugifyHandle(source);
    if (base) break;
  }
  if (!base) base = `user-${String(profile.id).slice(-8).toLowerCase()}`;

  let username = base;
  let counter = 2;
  while (await userModel.exists({ username })) {
    username = `${base}-${counter}`;
    counter += 1;
  }
  return username;
};

/** Creates the Mongo row for a normalized Clerk profile. */
export const createUserFromProfile = async (profile) =>
  userModel.create({
    clerkId: profile.id,
    email: profile.email,
    username: await buildUsername(profile),
    displayName: `${profile.firstName || ""} ${profile.lastName || ""}`.trim(),
    img: profile.img,
  });

/**
 * Returns the Mongo user for a signed-in Clerk session, creating it on first
 * use if it's missing.
 *
 * The `user.created` webhook is still the primary path, but it can't reach a
 * local server without a tunnel, which left people signed in to Clerk yet
 * unable to post. This makes the webhook an optimization rather than a
 * requirement.
 */
export const ensureUser = async (clerkId) => {
  if (!clerkId) return null;

  const existing = await userModel.findOne({ clerkId });
  if (existing) return existing;

  const profile = normalizeClerkUser(await clerkClient.users.getUser(clerkId));
  if (!profile.id) return null;

  try {
    return await createUserFromProfile(profile);
  } catch (error) {
    // Two concurrent first requests can race on the unique index. The other
    // one won, so use its row.
    if (error?.code === 11000) return userModel.findOne({ clerkId });
    throw error;
  }
};
