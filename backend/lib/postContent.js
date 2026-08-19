/**
 * Normalizes the HTML a post body is stored as.
 *
 * Rich text pasted from Word, Google Docs, or a chat UI arrives with every
 * space as a non-breaking space and every run carrying the source app's own
 * colors. The spaces are the damaging part: a no-break space is by definition
 * a place the browser may not wrap, so a whole paragraph becomes one
 * unbreakable word and the article overflows its column instead of wrapping.
 * The colors are baked-in light-theme values that survive into dark mode.
 *
 * Runs on write rather than on render, so the stored post is the clean one and
 * every reader — and the editor on the next edit — sees the same thing.
 */

/** `color`, `background`, and `background-color` out of an inline style. */
const PASTED_COLORS = /(?:^|;)\s*(?:color|background|background-color)\s*:[^;]*/gi;

export const normalizePostHtml = (html) => {
  if (typeof html !== "string" || !html) return html ?? "";

  return html
    // The author never typed these; the source app did.
    .replace(/&nbsp;|&#160;|\u00a0/g, " ")
    .replace(/ style="([^"]*)"/gi, (match, style) => {
      const kept = style
        .replace(PASTED_COLORS, "")
        .replace(/^\s*;+|;+\s*$/g, "")
        .trim();
      return kept ? ` style="${kept}"` : "";
    })
    // Blank lines paste as empty blocks. An empty <li> still draws its bullet,
    // so those go even when they hold a <br>; an empty <p><br></p> is how Quill
    // stores a deliberate blank line, so only the truly empty ones go.
    .replace(/<li>(?:\s|<br\s*\/?>)*<\/li>/gi, "")
    .replace(/<(p|h[1-6])>\s*<\/\1>/gi, "")
    .trim();
};
