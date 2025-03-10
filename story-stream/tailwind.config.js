/** @type {import('tailwindcss').Config} */
export default {
  content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
      extend: {
          fontSize: {
              'xs': '0.7rem',    // Smaller text
              'sm': '0.8rem',    // Small text
              'base': '1rem',    // Standard text
              '2xl': '1.5rem',   // Large headings
              '3xl': '1.875rem', // Very large headings
          },
          fontWeight: {
              'light': 300,
              'normal': 400,
              'semibold': 600,
              'bold': 700,
          }
      },
  },
  plugins: [],
}