/** Clerk theming shared by the sign-in and sign-up screens. */
export const clerkAppearance = {
  variables: {
    colorPrimary: "#4B36B9",
    colorText: "#181A23",
    colorTextSecondary: "#565968",
    colorBackground: "#ffffff",
    colorInputBackground: "#ffffff",
    borderRadius: "0.85rem",
    fontFamily: "Inter, Montserrat, system-ui, sans-serif",
  },
  elements: {
    rootBox: "w-full",
    cardBox: "w-full shadow-none",
    card: "shadow-card border border-ink-900/[0.06] rounded-3xl",
    headerTitle: "font-display text-2xl font-bold tracking-tight",
    headerSubtitle: "text-ink-500",
    formButtonPrimary:
      "bg-ink-950 hover:bg-brand-800 text-sm normal-case font-semibold shadow-soft transition",
    socialButtonsBlockButton:
      "border-ink-900/10 hover:bg-ink-900/[0.04] transition",
    footerActionLink: "text-brand-700 hover:text-brand-800 font-semibold",
    formFieldInput: "border-ink-900/10 focus:border-brand-400",
  },
};
