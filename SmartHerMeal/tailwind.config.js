/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#D0B7D6',      // Soft lavender
        background: '#F0F0F0',   // Light gray
        accent: '#E0B0B3',       // Pale rose
      },
      fontFamily: {
        headline: ['Playfair Display'],
        body: ['PT Sans'],
      },
    },
  },
  plugins: [],
}