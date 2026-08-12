/**
 * Authors carry two names: `username` is the unique handle used in ?author=
 * links, `displayName` is the human one. Older rows predate displayName and
 * stored the human name in `username`, so display falls back to it.
 */
export const authorName = (user) =>
  user?.displayName?.trim() || user?.username || "Unknown";

/** Always link with the handle, never the display name. */
export const authorHandle = (user) => user?.username || "";

/** Initials for the fallback avatar. */
export const authorInitials = (user) => {
  const name = authorName(user);
  const parts = name.trim().split(/\s+/);
  const initials =
    parts.length > 1 ? `${parts[0][0]}${parts[1][0]}` : name.slice(0, 2);
  return initials.toUpperCase();
};
