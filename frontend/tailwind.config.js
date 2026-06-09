/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        vittas: {
          blue: '#1D4ED8',
          blueSoft: '#DBEAFE',
          navy: '#1E3A8A',
          green: '#16A34A',
          greenDark: '#166534',
          mint: '#DCFCE7',
          gray: '#F8FAFC',
          slate: '#F1F5F9',
          border: '#E5E7EB',
          text: '#1F2937',
          muted: '#4B5563',
          danger: '#DC2626',
          dangerSoft: '#FEE2E2',
          warning: '#F59E0B',
          warningSoft: '#FEF3C7',
        },
      },
    },
  },
  plugins: [],
};
