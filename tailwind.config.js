/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#070b17",
        panel: "#0d1324",
        line: "#1c2740",
        electric: "#5b8cff",
        violet: "#8b5cf6",
        aqua: "#22d3ee",
        rose: "#fb7185",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Sora", "Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 35px rgba(91,140,255,.16)",
        "glow-lg": "0 0 60px rgba(91,140,255,.35)",
        "glow-violet": "0 0 45px rgba(139,92,246,.35)",
        "inner-glow": "inset 0 0 20px rgba(91,140,255,.15)",
      },
      keyframes: {
        float: {
          "0%,100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-14px)" },
        },
        aurora: {
          "0%,100%": { transform: "translate(0,0) scale(1)", opacity: "0.55" },
          "33%": { transform: "translate(40px,-30px) scale(1.15)", opacity: "0.8" },
          "66%": { transform: "translate(-30px,25px) scale(0.95)", opacity: "0.6" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        spinSlow: {
          to: { transform: "rotate(360deg)" },
        },
        gradientX: {
          "0%,100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        pulseRing: {
          "0%": { transform: "scale(0.8)", opacity: "0.7" },
          "100%": { transform: "scale(2.2)", opacity: "0" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        tilt: {
          "0%,100%": { transform: "rotate(-1deg)" },
          "50%": { transform: "rotate(1deg)" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        aurora: "aurora 18s ease-in-out infinite",
        shimmer: "shimmer 2.5s linear infinite",
        "spin-slow": "spinSlow 14s linear infinite",
        "gradient-x": "gradientX 6s ease infinite",
        "pulse-ring": "pulseRing 2s cubic-bezier(0.2,0.6,0.4,1) infinite",
        marquee: "marquee 28s linear infinite",
        tilt: "tilt 8s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
