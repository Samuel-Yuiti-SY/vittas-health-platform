/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        vittas: {
          blue: "#086575",
          blueSoft: "#e5f5f3",
          navy: "#103e57",
          green: "#006a6a",
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
