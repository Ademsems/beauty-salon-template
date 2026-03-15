/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        charcoal: {
          DEFAULT: "#0a0a0a",
          50:  "#f5f5f4",
          100: "#e8e7e5",
          900: "#0a0a0a",
          950: "#060606",
        },
        gold: {
          DEFAULT: "#c9a96e",
          light:   "#dfc08a",
          muted:   "rgba(201,169,110,0.15)",
        },
      },
      fontFamily: {
        serif:   ["'Playfair Display'", "Georgia", "serif"],
        display: ["'Cormorant'", "Georgia", "serif"],
        sans:    ["'DM Sans'", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        widest2: "0.22em",
        widest3: "0.3em",
      },
    },
  },
  plugins: [],
};
