/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        vittas: {
          blue: "#245b65",
          blueSoft: "#e4f0ee",
          navy: "#193f49",
          green: "#287451",
          greenDark: "#166534",
          mint: "#DCFCE7",
          gray: "#f8faf9",
          slate: "#F1F5F9",
          border: "#dbe4df",
          text: "#1F2937",
          muted: "#4B5563",
          danger: "#DC2626",
          dangerSoft: "#FEE2E2",
          warning: "#F59E0B",
          warningSoft: "#FEF3C7",
        },
      },
    },
  },
  plugins: [],
};
