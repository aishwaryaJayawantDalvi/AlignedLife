/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0b0f14",
        mist: "#111826",
        panel: "#1a2635",
        glow: "#7dd3fc",
        mint: "#6ee7b7",
        amber: "#fbbf24"
      },
      fontFamily: {
        sans: ["'Manrope'", "ui-sans-serif", "system-ui"]
      }
    }
  },
  plugins: []
};
