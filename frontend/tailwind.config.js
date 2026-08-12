/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Warm paper tones — the page ground.
        paper: {
          DEFAULT: "#FBFAF7",
          soft: "#F4F2EC",
          deep: "#EAE7DE",
        },
        // Neutral text/border ramp, very slightly warm so it sits on paper.
        ink: {
          50: "#F7F7F8",
          100: "#EDEDF0",
          200: "#DBDBE1",
          300: "#BCBDC7",
          400: "#9496A4",
          500: "#6F7284",
          600: "#565968",
          700: "#434654",
          800: "#2B2D38",
          900: "#181A23",
          950: "#0C0D13",
        },
        // Primary brand — indigo/violet.
        brand: {
          50: "#F0F0FE",
          100: "#E3E3FD",
          200: "#CACAFB",
          300: "#A8A6F7",
          400: "#8781F0",
          500: "#6E63E7",
          600: "#5B47D8",
          700: "#4B36B9",
          800: "#3D2D94",
          900: "#342A76",
          950: "#201847",
        },
        // Editorial highlight — warm amber.
        accent: {
          100: "#FDF0D5",
          300: "#F7CC7A",
          400: "#F2B444",
          500: "#E29B1D",
          600: "#BE7A0F",
        },
      },
      fontFamily: {
        sans: ["Inter", "Montserrat", "system-ui", "sans-serif"],
        display: ["Fraunces", "Georgia", "serif"],
      },
      letterSpacing: {
        eyebrow: "0.18em",
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(12, 13, 19, 0.04), 0 6px 16px -8px rgba(12, 13, 19, 0.10)",
        card: "0 1px 3px rgba(12, 13, 19, 0.05), 0 18px 40px -24px rgba(12, 13, 19, 0.28)",
        lift: "0 2px 4px rgba(12, 13, 19, 0.04), 0 32px 60px -28px rgba(12, 13, 19, 0.38)",
        glass:
          "inset 0 1px 0 rgba(255, 255, 255, 0.65), 0 10px 30px -18px rgba(12, 13, 19, 0.30)",
        ring: "0 0 0 1px rgba(12, 13, 19, 0.06)",
      },
      backgroundImage: {
        "grid-faint":
          "linear-gradient(to right, rgba(12,13,19,0.045) 1px, transparent 1px), linear-gradient(to bottom, rgba(12,13,19,0.045) 1px, transparent 1px)",
        "brand-sheen":
          "linear-gradient(135deg, #201847 0%, #3D2D94 45%, #5B47D8 100%)",
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
      typography: {},
    },
  },
  plugins: [],
};
