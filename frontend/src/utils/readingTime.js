const WORDS_PER_MINUTE = 225;

/**
 * Rough read-time estimate from a post's rendered HTML (or plain description).
 * Returns whole minutes, never less than 1, or null when there's nothing to
 * measure, so callers can hide the label rather than print "0 min".
 */
export const readingTime = (html) => {
  if (!html) return null;

  const words = html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  if (!words) return null;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
};

/** Compact view counts: 1240 → "1.2k". */
export const formatCount = (n) => {
  const value = Number(n) || 0;
  if (value < 1000) return `${value}`;
  if (value < 1_000_000) return `${(value / 1000).toFixed(value < 10_000 ? 1 : 0)}k`;
  return `${(value / 1_000_000).toFixed(1)}m`;
};
