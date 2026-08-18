/** @type {import('tailwindcss').Config} */


const withAlpha = (variable) => `rgb(var(${variable}) / <alpha-value>)`;

const ramp = (prefix, stops) =>
  Object.fromEntries(stops.map((s) => [s, withAlpha(`--c-${prefix}-${s}`)]));

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: ["class", '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        // The page ground.
        paper: {
          DEFAULT: withAlpha("--c-paper"),
          soft: withAlpha("--c-paper-soft"),
          deep: withAlpha("--c-paper-deep"),
        },
        // Raised panels: cards, bars, popovers.
        surface: {
          DEFAULT: withAlpha("--c-surface"),
          soft: withAlpha("--c-surface-soft"),
          high: withAlpha("--c-surface-high"),
        },

        ink: ramp("ink", [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]),
        // Primary brand — jade.
        brand: ramp(
          "brand",
          [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]
        ),
        // Editorial highlight — warm clay.
        accent: ramp("accent", [50, 100, 200, 300, 400, 500, 600, 700]),
        // Legible foreground for a filled brand surface.
        onbrand: withAlpha("--c-on-brand"),
        // Tailwind's own red/rose are hardcoded hexes that glare in dark mode,
        // so the shades this app actually uses are re-pointed at variables.
        red: ramp("red", [50, 100, 500, 600, 700]),
        rose: ramp("rose", [50, 100, 500, 600, 700]),
        // Default hairline colour, used by the global border reset.
        line: withAlpha("--c-line"),

       
        sheen: {
          100: withAlpha("--c-sheen-100"),
          200: withAlpha("--c-sheen-200"),
          300: withAlpha("--c-sheen-300"),
        },
        flare: withAlpha("--c-flare"),
        scrim: withAlpha("--c-scrim"),
        ondark: {
          bg: withAlpha("--c-ondark-bg"),
          fg: withAlpha("--c-ondark-fg"),
        },
        code: {
          bg: withAlpha("--c-code-bg"),
          fg: withAlpha("--c-code-fg"),
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["'Bricolage Grotesque'", "Inter", "system-ui", "sans-serif"],
        reading: ["'Source Serif 4'", "Georgia", "Cambria", "serif"],
      },
      letterSpacing: {
        eyebrow: "0.18em",
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      maxWidth: {
        shell: "88rem",
        reading: "44rem",
      },
      boxShadow: {
        soft: "0 1px 2px rgb(var(--shadow) / var(--shadow-a1)), 0 6px 16px -8px rgb(var(--shadow) / var(--shadow-a2))",
        card: "0 1px 3px rgb(var(--shadow) / var(--shadow-a1)), 0 18px 40px -24px rgb(var(--shadow) / var(--shadow-a3))",
        lift: "0 2px 4px rgb(var(--shadow) / var(--shadow-a1)), 0 32px 60px -28px rgb(var(--shadow) / var(--shadow-a4))",
        glass:
          "inset 0 1px 0 rgb(var(--sheen-inner) / var(--sheen-inner-a)), 0 10px 30px -18px rgb(var(--shadow) / var(--shadow-a3))",
        ring: "0 0 0 1px rgb(var(--shadow) / 0.06)",
      },
      backgroundImage: {
        "grid-faint":
          "linear-gradient(to right, rgb(var(--grid-line) / var(--grid-a)) 1px, transparent 1px), linear-gradient(to bottom, rgb(var(--grid-line) / var(--grid-a)) 1px, transparent 1px)",
        "brand-sheen":
          "linear-gradient(135deg, rgb(var(--c-sheen-start)) 0%, rgb(var(--c-sheen-mid)) 48%, rgb(var(--c-sheen-end)) 100%)",
      },
      backgroundSize: {
        grid: "44px 44px",
      },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(14px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s cubic-bezier(0.22, 1, 0.36, 1) both",
        "fade-in": "fade-in 0.5s ease-out both",
        marquee: "marquee 32s linear infinite",
        shimmer: "shimmer 1.8s infinite",
        float: "float 6s ease-in-out infinite",
        "spin-slow": "spin 22s linear infinite",
      },
    },
  },
  plugins: [],
};
