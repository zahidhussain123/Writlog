/*
 * Clerk theming shared by the sign-in and sign-up screens.
 *
 * The colour variables point at the same CSS custom properties the rest of the
 * app uses. Clerk renders into this document, so `rgb(var(--c-…))` resolves
 * against whichever theme is active and the widget follows the toggle without
 * needing to be re-mounted.
 */
const token = (name) => `rgb(var(--c-${name}))`;

export const clerkAppearance = {
  variables: {
    colorPrimary: token("brand-600"),
    colorText: token("ink-950"),
    colorTextSecondary: token("ink-600"),
    colorBackground: token("surface"),
    colorInputBackground: token("surface"),
    colorInputText: token("ink-900"),
    colorDanger: token("red-600"),
    borderRadius: "0.85rem",
    fontFamily: "Inter, system-ui, sans-serif",
  },
  elements: {
    rootBox: "w-full",
    cardBox: "w-full shadow-none",
    card: "shadow-card border border-ink-900/[0.07] rounded-3xl bg-surface",
    headerTitle: "font-display text-2xl font-bold tracking-tight",
    headerSubtitle: "text-ink-500",
    formButtonPrimary:
      "bg-ink-950 hover:bg-brand-700 text-sm normal-case font-semibold shadow-soft transition",
    socialButtonsBlockButton:
      "border-ink-900/[0.12] hover:bg-ink-900/[0.05] transition",
    footerActionLink: "text-brand-700 hover:text-brand-600 font-semibold",
    formFieldInput: "border-ink-900/[0.12] focus:border-brand-400",
  },
};
